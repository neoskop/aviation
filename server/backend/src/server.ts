import * as express from 'express';
import {registerControllersFromFolder} from "giuseppe";
import session = require("express-session");
import * as passport from "passport";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as cookies from "cookie-parser";
import * as passportGoogle from "passport-google-oauth";
import * as passportBearer from "passport-http-bearer";
import mongoose = require("mongoose");
import {IProjectModel} from "./models/project";
import {projectSchema} from "./schemas/project";
import * as connectMongo from 'connect-mongo';
import { Request } from 'express-serve-static-core';
import * as http from "http";
import * as url from "url";
import * as io from 'socket.io';
import {IncomingMessage} from "http";
import {Express} from "express";

export class App {
    static express: Express = express();
    static sioServer: SocketIO.Server;
    static sioClients: Map<string, Array<SocketIO.Socket>> = new Map<string, Array<SocketIO.Socket>>();
    static model: any = {};
    private static connection: mongoose.Connection;
    private static server;

    static main() {
        this.init().then(() => {
            App.server.listen(8080);
        });
    }

    static async init()  {
        App.initPassport();
        App.initModel();
        await App.initExpress();
        App.server = http.createServer(App.express);
        App.initSioServer();
    }

    private static async initExpress() {
        let MongoStore = connectMongo(session);

        App.express.use(session({
            secret: 'session_secret',
            saveUninitialized: true,
            resave: true,
            proxy: true,
            store: new MongoStore(
                {mongooseConnection: App.connection}
            )
        }));

        App.express.use(cors(App.corsOptions));
        App.express.use(bodyParser.json());
        App.express.use(bodyParser.urlencoded({extended: false}));
        App.express.use(cookies());
        App.express.use(passport.initialize());
        App.express.use(passport.session());

        let router: express.Router = await registerControllersFromFolder({
            folderPath: '../dist/controllers',
            root: __dirname
        });
        App.express.use(router);
    }

    private static corsOptions(req: Request, callback) {
        let origin: any = process.env['FRONTEND_URL'] || 'http://localhost:3000';

        if (req.path.startsWith('/features') || req.path.startsWith('/updates')) {
            origin = true;
        }

        callback(null, {
            credentials: true,
            origin: origin
        });
    }

    static initPassport() {
        if (process.env['GOOGLE_CLIENT_ID'] != null && process.env['GOOGLE_CLIENT_SECRET']) {
            passport.use(new passportGoogle.OAuth2Strategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
                passReqToCallback: true
            }, (req, accessToken, refreshToken, profile, done) => {
                process.nextTick(() => {
                    if(profile._json.domain === "neoskop.de"){
                        done(null, profile);
                    } else {
                        done(null, new Error("Invalid host domain"));
                    }
                });
            }));
        }

        passport.use(new passportBearer.Strategy(
            (token, done) => {
                App.model.project.findOne({ token: token }, function (err, project) {
                    if (err) {
                        return done(err);
                    }

                    if (!project) {
                        return done(null, false);
                    }

                    return done(null, project);
                });
            }
        ));

        passport.serializeUser((user: any, done) => {
            done(null, user);
        });

        passport.deserializeUser((obj: any, done) => {
            done(null, obj);
        });
    }

    private static initModel() {
        mongoose.Promise = global.Promise;
        this.connection = mongoose.createConnection("mongodb://mongo:27017/aviation");
        this.model.project = App.connection.model<IProjectModel>("Project", projectSchema);
    }

    private static initSioServer() {
        App.sioServer = io(App.server);

        App.sioServer.on('connection', (socket: SocketIO.Socket) => {
            let request = socket.request as IncomingMessage;
            let token: string = url.parse(request.url, true).query.auth_token;
            App.model.project.findOne({ token: token }, (err, project: IProjectModel) => {
                if (err) {
                    console.error('Project not found', err);
                }

                if (!project) {
                    socket.disconnect(true);
                }

                if (App.sioClients.has(token)) {
                    App.sioClients.get(token).push(socket);
                } else {
                    App.sioClients.set(token, [socket]);
                }
            });

            socket.on('close', () => {
                App.sioClients.forEach((clients) => {
                    clients.forEach(function(client, i, clientList) {
                        if (client === socket) {
                            clientList.splice(i, 1);
                        }
                    });
                });
            });
        });
    }
}
