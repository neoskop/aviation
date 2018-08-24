import * as chai from 'chai';
import {AviationFeature} from "../model/aviation-feature";
import * as httpMocks from 'node-mocks-http';
import * as jsdom from 'jsdom';

const dom = new jsdom.JSDOM('');

before(() => {
    chai.should();

    global['document'] = dom;
    global['window'] = dom.window;

    let nodeLocalStorage = require('node-localstorage');
    let LocalStorage = nodeLocalStorage.LocalStorage;

    global['localStorage'] = new LocalStorage('./tmp');
    global['window'].localStorage = global['localStorage'];
});

describe('Aviation feature', () => {
    it('should evaluate to true if it is enabled and the function is disabled', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: true,
            functionCode: '',
            functionEnabled: false
        });
        return sut.evaluate().should.be.true;
    });

    it('should evaluate to false if it is disabled and the function is disabled', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: '',
            functionEnabled: false
        });
        return sut.evaluate().should.be.false;
    });

    it('should evaluate to true if it is disabled but the function is enabled and returns true', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: 'return true;',
            functionEnabled: true
        });
        return sut.evaluate().should.be.true;
    });

    it('should evaluate to false if it is disabled but the function is enabled and returns false', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: 'return false;',
            functionEnabled: true
        });
        return sut.evaluate().should.be.false;
    });

    it('should evaluate to false if it is disabled but the function is enabled and returns nothing', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: '',
            functionEnabled: true
        });
        return sut.evaluate().should.be.false;
    });

    it('should allow the function to check the hostname in node.js contexts', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: 'return hostname == "foo"',
            functionEnabled: true
        });
        let req: httpMocks.MockRequest = httpMocks.createRequest({
            url: 'https://foo',
            headers: {
                Host: 'foo'
            }
        });
        return sut.evaluate(req).should.be.true;
    });

    it('should allow the function to check the hostname in browser context', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: 'return hostname == "foo"',
            functionEnabled: true
        });

        dom.reconfigure({ url: "https://foo/bar" });
        return sut.evaluate().should.be.true;
    });

    it('should should be testable in node.js contexts', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: 'return preview',
            functionEnabled: true
        });
        let req: httpMocks.MockRequest = httpMocks.createRequest({
            url: 'https://foo',
            headers: {
                Host: 'foo',
                'X-Aviation-Preview': 'true'
            }
        });
        return sut.evaluate(req).should.be.true;
    });

    it('should should be testable in browser contexts', () => {
        let sut: AviationFeature = new AviationFeature({
            name: 'foo',
            enabled: false,
            functionCode: 'return preview',
            functionEnabled: true
        });

        window.localStorage.setItem('aviationPreview', 'true');
        let result = sut.evaluate().should.be.true;
        window.localStorage.removeItem('aviationPreview');
        return result;
    });
});