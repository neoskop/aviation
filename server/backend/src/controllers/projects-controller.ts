import {
    Controller, Delete, ErrorHandler, Get, Post, Put, Req, Res, Route,
    UrlParam
} from 'giuseppe';
import {Response} from 'express-serve-static-core';
import {Request} from 'express-serve-static-core';
import {App} from "../server";
import {IProject} from "../interfaces/project";
import {AppController} from "./app-controller";
import {AuthMiddleware} from "../middleware/auth-middleware";
import {EntityAlreadyExistsError} from "../errors/entity-already-exists-error";
import {EntityNotFoundError} from "../errors/entity-not-found-error";
import {EntityInvalidError} from "../errors/entity-invalid-error";
import {MongoError} from "mongodb";
import {DuplicateKeyError} from "../errors/duplicate-key-error";

@Controller('/projects', AuthMiddleware.allowAdmin)
export class ProjectsController extends AppController {
    /**
     * @api {get} /projects List projects
     * @apiPermission admin
     * @apiName ProjectsList
     * @apiGroup Projects
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *   {
     *     "name": "example-1",
     *     "title": "Example One",
     *     "color": "#4d2860",
     *     "createdAt": "2017-06-02T15:38:55.691Z",
     *     "features": []
     *   },
     *   {
     *     "name": "example-2",
     *     "title": "Example Two",
     *     "color": "",
     *     "createdAt": "2017-05-30T09:31:25.552Z",
     *     "features": []
     *   }
     * ]
     */
    @Get()
    public list(@Res() res: Response) {
        App.model.project.find().sort({name: 1}).exec().then((projects) => {
            res.json(AppController.removeInternalAttributes(projects));
        }).catch((reason) => {
            console.error('Getting projects failed', reason);
        });
    }

    /**
     * @api {get} /projects/:name Get core data of a project
     * @apiPermission admin
     * @apiName ProjectsShow
     * @apiGroup Projects
     *
     * @apiParam {String} name Technical name of the project.
     *
     * @apiSuccess {String} name Technical name of the project.
     * @apiSuccess {String} token 32 character hex token to authenticate API requests.
     * @apiSuccess {String} color CSS color code of project
     * @apiSuccess {String} createdAt Date of project creation.
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "name": "example-1",
     *   "title": "Example One",
     *   "token": "3505ac3d4e7853cf0186597a83840bf32fc406726b0fb2cccbb202d9be4e7572",
     *   "createdAt":"2017-05-29T11:27:19.586Z",
     *   "color":"red"
     * }
     */
    @Get(':name')
    public show(@Res() res: Response, @UrlParam('name') name: string) {
        App.model.project.findOne({name: name}, (err, project) => {
            if (err) {
                throw err;
            }

            if (project == null) {
                new EntityNotFoundError('Project').respond(res);
            } else {
                res.json(AppController.removeInternalAttributes(project));
            }
        });
    }

    /**
     * @api {delete} /projects/:name Delete a project
     * @apiPermission admin
     * @apiName ProjectsDelete
     * @apiGroup Projects
     *
     * @apiParam {String} name Technical name of the project.
     *
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": {
     *         "internalCode": 1001,
     *         "userMessage": "Project already exists",
     *         "developerMessage": "Project with same name already exists"
     *       }
     *     }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 204 No Content
     *     {}
     */
    @Delete(':name')
    public delete(@Res() res: Response, @UrlParam('name') name: string) {
        App.model.project.findOneAndRemove({name: name}, (err, project) => {
            if (err) {
                throw err;
            }

            if (project == null) {
                new EntityNotFoundError('Project').respond(res);
            } else {
                res.status(204).send({});
            }
        });
    }

    /**
     * @api {post} /projects Create a project
     * @apiPermission admin
     * @apiName ProjectsCreate
     * @apiGroup Projects
     * @apiParam {String} name An ASCII identifier for the new project
     * @apiParamExample {json} Request-Example:
     * { "name": "technical-name" }
     *
     * @apiErrorExample {json} Name is taken response
     *     HTTP/1.1 400 Bad request
     *     {
     *       "error": "project already exists"
     *     }
     * @apiErrorExample {json} Generic error response
     *     HTTP/1.1 400 Bad request
     *     {
     *       "error": "invalid project"
     *     }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "name": "example-3",
     *        "token": "86ad6dcf45ff4579eaf784d070ff9ec9bed5bad72a125d8c66319bd3d4d28355"
     *     }
     */
    @Post()
    public create(@Res() res: Response, @Req() req: Request) {
        let project: IProject = req.body;
        App.model.project.findOne({name: project.name}, (err, result) => {
            if (err) {
                throw err;
            }

            if (result != null) {
                new EntityAlreadyExistsError('Project').respond(res);
            } else {
                App.model.project(project).save().then((result) => {
                    res.status(201).json(AppController.removeInternalAttributes(result));
                }).catch((err: MongoError) => {
                    console.error('Creating project failed', err);

                    switch (err.code) {
                        case 11001:
                        case 11000:
                            new DuplicateKeyError('Project', err).respond(res);
                            break;

                        default:
                            new EntityInvalidError('Project', 'name', 'title').respond(res);
                            break;
                    }
                });
            }
        });
    }

    /**
     * @api {put} /projects/:name Update a project
     * @apiPermission admin
     * @apiName ProjectsUpdate
     * @apiGroup Projects
     * @apiParam {String} name ASCII identifier of the project
     * @apiParamExample {json} Request-Example:
     * { "name": "new-technical-name", "token": "3505ac3d4e7853cf0186597a83840bf32fc406726b0fb2cccbb202d9be4e7572", "color": "#000" }
     *
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 400 Bad request
     *     {
     *       "error": "updating project failed"
     *     }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 Ok
     *     {}
     */
    @Put(':name')
    public update(@Res() res: Response, @Req() req: Request, @UrlParam('name') name: string) {
        let project: IProject = req.body;
        App.model.project.findOneAndUpdate({name: name}, project, (err, result: IProject) => {
            if (err || result == null) {
                console.error('Updating project failed', err);

                switch (err.code) {
                    case 11001:
                    case 11000:
                        new DuplicateKeyError('Project', err).respond(res);
                        break;

                    default:
                        new EntityInvalidError('Project', 'name', 'title').respond(res);
                        break;
                }
            } else {
                res.status(200).json(AppController.removeInternalAttributes(result));
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