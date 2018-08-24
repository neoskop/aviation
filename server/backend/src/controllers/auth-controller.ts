import {AppController} from "./app-controller";
import {Controller, ErrorHandler, Get, Req, Res} from "giuseppe";
import * as passport from "passport";
import {NextFunction} from "express";
import { Response } from 'express-serve-static-core';
import { Request } from 'express-serve-static-core';
import {AuthMiddleware} from "../middleware/auth-middleware";

@Controller('/auth')
export class AuthController extends AppController {
    /**
     * @api {get} /auth Get info on current user
     * @apiName AuthIndex
     * @apiGroup Auth
     * @apiPermission admin
     *
     * @apiSuccess {String} name Full name of the user.
     * @apiSuccess {String} photo URL to photo of user (50x50).
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "name": "Arne Diekmann",
     *   "photo": "https://lh4.googleusercontent.com/-gyHHFoXF3vE/AAAAAAAAAAI/AAAAAAAAAKw/46feVUF9h9o/photo.jpg?sz=50"
     * }
     */
    @Get('', AuthMiddleware.allowAdmin)
    public index(@Res() res: Response, @Req() req: Request) {
        res.json({
            name: req.user.displayName,
            photo: req.user.photos[0].value
        });
    }

    /**
     * @api {get} /auth/google Initiate Gooogle OAuth2
     * @apiName AuthGoogle
     * @apiGroup Auth
     * @apiPermission none
     */
    @Get('/google')
    public auth(@Res() res: Response, @Req() req: Request, next: NextFunction) {
        passport.authenticate('google', { scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
        ] })(req, res, next);
    }

    @Get('/google/callback')
    public authCallback(@Res() res: Response, @Req() req: Request, next: NextFunction) {
        passport.authenticate('google', (err, user) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect("/"); }

            req.login(user, (err) => {
                if (err) { return next(err); }

                return res.redirect(process.env['FRONTEND_URL'] || "/projects");
            });
        })(req, res, null);
    }

    /**
     * @api {get} /auth/logout Logout user
     * @apiName AuthLogout
     * @apiGroup Auth
     * @apiPermission admin
     */
    @Get('/logout', AuthMiddleware.allowAdmin)
    public logout(@Res() res: Response, @Req() req: Request) {
        req.logout();
        res.status(200).json({});
    }

    @ErrorHandler()
    public errorHandler(req: Request, res: Response, error: Error): void {
        res.status(500).json({
            error: {
                internalCode: 1000,
                userMessage: 'Internal server error',
                developerMessage: 'Unexpected server error occurred. Please check the logs.'
            }
        });
    }
}