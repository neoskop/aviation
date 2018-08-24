import * as passport from "passport";
import {Request, Response} from 'express-serve-static-core';

export class AuthMiddleware {
    static allowAPIOnly(req, res, next) {
        passport.authenticate('bearer', {session: false}, (err, user) => {
            if (err || !user) {
                AuthMiddleware.errorResponse(res, 1006, 'You are not authorized and need to do so via bearer token.');
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        AuthMiddleware.errorResponse(res, 1006, 'You are not authorized and need to do so via bearer token.');
                    } else {
                        next();
                    }
                });
            }
        })(req, res, next);
    }

    static allowAPI(req, res, next) {
        if (AuthMiddleware.isAuthenticated(req)) {
            next();
        } else {
            passport.authenticate('bearer', {session: false}, () => {
                AuthMiddleware.errorResponse(res, 1005, 'You are not authorized and need to do so via either /auth/google or via bearer token.');
            })(req, res, next);
        }
    }

    static allowAdmin(req, res, next) {
        if (AuthMiddleware.isAuthenticated(req)) {
            next();
        } else {
            AuthMiddleware.errorResponse(res, 1004, 'You are not authorized and need to do so via /auth/google.');
        }
    }

    private static isAuthenticated(req: Request) {
        if (process.env['NODE_ENV'] == 'test' && req.get('X-Authenticated') == 'true') {
            return true;
        }

        return req.isAuthenticated();
    }

    private static errorResponse(res: Response, internalCode: number, devMessage: string) {
        res.status(401).json({
            error: {
                internalCode: internalCode,
                userMessage: 'You are not authorized',
                developerMessage: devMessage
            }
        });
    }
}