import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {App} from "../server";
import {AuthMiddleware} from "../middleware/auth-middleware";

AuthMiddleware.allowAdmin = (req, res, next) => next();
AuthMiddleware.allowAPI = (req, res, next) => next();
AuthMiddleware.allowAPIOnly = (req, res, next) => next();

before((done) => {
    chai.use(chaiHttp);
    App.init().then(done).catch((err) => {
        throw err;
    });
});

beforeEach((done) => {
    App.model.project.remove({}, (err) => {
        done();
    })
});

describe('Projects controller', () => {
    it('should return empty array if no projects exist', () => {
        return chai.request(App.express)
            .get('/projects')
            .then(res => {
                chai.expect(res).to.have.status(200).and.be.json;
                chai.expect(res.body).to.be.an('array').that.is.empty;
            })
            .catch(err => {
                throw err;
            });
    });

    it('should create a project if all mandatory fields are supplied', () => {
        return chai.request(App.express)
            .post('/projects')
            .send({
                name: 'foo',
                title: 'bar',
                token: 'foobar'
            }).then(res => {
                chai.expect(res).to.have.status(201);
            })
            .catch(err => {
                throw err;
            });
    });
});
