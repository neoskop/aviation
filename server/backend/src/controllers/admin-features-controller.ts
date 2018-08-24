import {AppController} from "./app-controller";
import {Controller, Delete, ErrorHandler, Get, Post, Put, Req, Res, UrlParam} from "giuseppe";
import {App} from "../server";
import { Response } from 'express-serve-static-core';
import { Request } from 'express-serve-static-core';
import {IFeature} from "../interfaces/feature";
import {AuthMiddleware} from "../middleware/auth-middleware";
import {EntityNotFoundError} from "../errors/entity-not-found-error";
import {EntityAlreadyExistsError} from "../errors/entity-already-exists-error";
import {EntityInvalidError} from "../errors/entity-invalid-error";
import {IProjectModel} from "../models/project";

@Controller('/projects/:projectName/features', AuthMiddleware.allowAdmin)
export class AdminFeaturesController extends AppController {
    /**
     * @api {get} /projects/:projectName/features List features of a project
     * @apiPermission admin
     * @apiName FeaturesListAsAdmin
     * @apiGroup Features
     * @apiParam {String} projectName An ASCII identifier for the new project
     * @apiParamExample {json} Request-Example
     * { "name": "example-1" }
     *
     * @apiSuccessExample {json} Success-Response
     * HTTP/1.1 200 OK
     * [
     *   {
     *     "name": "test-feature-1",
     *     "title": "Test Feature One",
     *     "description": "Awesome new feature!1",
     *     "enabled": true,
     *     "createdAt": "2017-05-30T09:55:42.706Z"
     *   }
     * ]
     */
    @Get()
    public listAsAdmin(@Res() res: Response, @UrlParam('projectName') projectName: string) {
        App.model.project.findOne({name: projectName}, (err, project) => {
            if (err) {
                throw err;
            }

            if (project == null) {
                new EntityNotFoundError('Project').respond(res);
            } else {
                res.json(AppController.removeInternalAttributes(project.features));
            }
        });
    }

    /**
     * @api {get} /projects/:projectName/features Create a feature
     * @apiPermission admin
     * @apiName FeaturesCreate
     * @apiGroup Features
     * @apiParam {String} projectName An ASCII identifier for the new project
     * @apiParamExample {json} Request-Example
     * {
     *  "name": "test-feature-1",
     *  "title": "Test Feature One",
     *  "description": "Awesome new feature!1",
     *  "enabled": true
     * }
     *
     * @apiSuccessExample {json} Success-Response
     * HTTP/1.1 201 Created
     * {
     *   "name": "test-feature-1",
     *   "title": "Test Feature One",
     *   "description": "Awesome new feature!1",
     *   "enabled": true,
     *   "createdAt": "2017-05-30T09:55:42.706Z"
     * }
     */
    @Post()
    public create(@Req() req: Request, @Res() res: Response, @UrlParam('projectName') projectName: string) {
        App.model.project.findOne({name: projectName}, (err, project: IProjectModel) => {
            if (err) {
                throw err;
            }

            if (project == null) {
                new EntityNotFoundError('Project').respond(res);
            } else {
                let feature: IFeature = req.body;

                if (project.features.find(f => f.name == feature.name)) {
                    new EntityAlreadyExistsError('Feature').respond(res);
                } else {
                    project.features.push(feature);
                    project.save().then((result) => {
                        res.status(201).send(AppController.removeInternalAttributes(result));
                        this.notifyWebSocketReceivers(project, feature);
                    }).catch(() => {
                        new EntityInvalidError('Feature', 'name', 'title', 'enabled').respond(res);
                    });
                }
            }
        });
    }

    /**
     * @api {put} /projects/:projectName/features/:name Update a feature
     * @apiPermission admin
     * @apiName FeaturesUpdate
     * @apiGroup Features
     * @apiParam {String} projectName ASCII identifier of the project
     * @apiParam {String} name ASCII identifier of the feature
     * @apiParamExample {json} Request-Example:
     * PUT /projects/example-1/features/feature-1
     * {
     *   "name": "new-name-test-feature-1",
     *   "title": "New Name Test Feature One",
     *   "description": "Awesome new feature!!",
     *   "enabled": false
     * }
     *
     * @apiErrorExample {json} Project not found response
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "project does not exist"
     *     }
     * @apiErrorExample {json} Feature not found response
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "feature does not exist"
     *     }
     * @apiErrorExample {json} Generic error response
     *     HTTP/1.1 400 Bad request
     *     {
     *       "error": "updating feature failed"
     *     }
     * @apiSuccessExample {json} Success-Response
     *     HTTP/1.1 200 Ok
     *     {}
     */
    @Put(':name')
    public update(@Res() res: Response, @Req() req: Request, @UrlParam('projectName') projectName: string, @UrlParam('name') name: string) {
        App.model.project.findOne({name: projectName}, (err, project: IProjectModel) => {
            if (err) {
                throw err;
            }

            if (project == null) {
                new EntityNotFoundError('Project').respond(res);
            } else {
                let feature: IFeature = req.body;
                let updated = false;

                project.features.forEach((f, i) => {
                    if (f.name == name) {
                        project.features[i] = feature;
                        updated = true;
                    }
                });

                if (updated) {
                    project.save().then((project) => {
                        res.status(200).send({});
                        this.notifyWebSocketReceivers(project, feature);
                    }).catch((err) => {
                        console.error('updating feature failed', err);
                        res.status(400).json({error: 'updating feature failed'});
                    });
                } else {
                    new EntityNotFoundError('Feature').respond(res);
                }
            }
        });
    }

    /**
     * @api {delete} /projects/:projectName/features/:name Delete a feature
     * @apiPermission admin
     * @apiName FeaturesDelete
     * @apiGroup Features
     *
     * @apiParam {String} projectName ASCII identifier of the project
     * @apiParam {String} name ASCII identifier of the feature
     *
     * @apiErrorExample {json} Project not found response
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "project does not exist"
     *     }
     * @apiErrorExample {json} Feature not found response
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "feature does not exist"
     *     }
     * @apiErrorExample {json} Generic error response
     *     HTTP/1.1 400 Bad request
     *     {
     *       "error": "removing feature failed"
     *     }
     * @apiSuccessExample {json} Success-Response
     *     HTTP/1.1 204 No Content
     *     {}
     */
    @Delete(':name')
    public delete(@Res() res: Response, @UrlParam('projectName') projectName: string, @UrlParam('name') name: string) {
        App.model.project.findOne({name: projectName}, (err, project) => {
            if (err) {
                throw err;
            }

            if (project == null) {
                new EntityNotFoundError('Project').respond(res);
            } else {
                let removed = false;

                project.features.forEach((f, i) => {
                    if (f.name == name) {
                        project.features[i].remove();
                        removed = true;
                    }
                });

                if (removed) {
                    project.save().then(() => {
                        res.status(204).send({});
                    }).catch((err) => {
                        console.error('removing feature failed', err);
                        res.status(400).json({error: 'removing feature failed'});
                    });
                } else {
                    new EntityNotFoundError('Feature').respond(res);
                }
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

    private notifyWebSocketReceivers(project, feature: IFeature) {
        let clients = App.sioClients.get(project.token);
        if (clients != null) {
            clients.forEach((socket: SocketIO.Socket) => {
                socket.emit('featureUpdate', JSON.stringify(AppController.removeInternalAttributes(feature)));
            });
        }
    }
}