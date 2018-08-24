import {AppController} from "./app-controller";
import {Controller, ErrorHandler, Get, Req, Res} from "giuseppe";
import {App} from "../server";
import {Response} from 'express-serve-static-core';
import {Request} from 'express-serve-static-core';
import {EntityNotFoundError} from "../errors/entity-not-found-error";
import {AuthMiddleware} from "../middleware/auth-middleware";

@Controller('/features', AuthMiddleware.allowAPIOnly)
export class FeaturesController extends AppController {
    /**
     * @api {get} /features List features as API client
     * @apiPermission api client
     * @apiName FeaturesList
     * @apiGroup Features
     *
     * @apiSuccessExample {json} Success-Response
     * HTTP/1.1 200 OK
     * [
     *   {
     *     "name": "test-feature-1",
     *     "title": "Test Feature One",
     *     "enabled": true,
     *     "createdAt": "2017-05-30T09:55:42.706Z"
     *   }
     * ]
     */
    @Get()
    public listAsAPIClient(@Req() req: Request, @Res() res: Response) {
        App.model.project.findOne({name: req.user.name}, (err, project) => {
            if (err) {
                throw err;
            }

            if (project == null) {
                new EntityNotFoundError('Project', 'token').respond(res);
            } else {
                res.json(AppController.removeInternalAttributes(project.features));
            }
        });
    }

    @ErrorHandler()
    public errorHandler(req: Request, res: Response, error: Error): void {
        console.error('Internal server error', error);
        res.status(500).json({
            error: {
                internalCode: 1000,
                userMessage: 'Internal server error',
                developerMessage: 'Unexpected server error occurred. Please check the logs.'
            }
        });
    }
}