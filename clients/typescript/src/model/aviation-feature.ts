import {isUndefined} from "util";
import {IncomingMessage} from "http";

export class AviationFeature {
    private _name: string;
    private _title: string;
    private _enabled: boolean;
    private _functionCode: string;
    private _functionEnabled: boolean;

    constructor(feature: any) {
        this._name = feature['name'];
        this._title = feature['title'];
        this._enabled = feature['enabled'];
        this._functionCode = feature['functionCode'];
        this._functionEnabled = feature['functionEnabled'];
    }

    set title(value: string) {
        this._title = value;
    }

    get title(): string {
        return this._title;
    }

    get name(): string {
        return this._name;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    get functionEnabled(): boolean {
        return this._functionEnabled;
    }

    get functionCode(): string {
        return this._functionCode;
    }

    public evaluate(request?: IncomingMessage): boolean {
        if (this._functionEnabled) {
            let hostname: string = '';
            let preview: boolean = false;

            if (request) {
                hostname = request.headers['host'];
                preview = request.headers['x-aviation-preview'] && request.headers['x-aviation-preview'] == 'true';
            } else if (typeof window != 'undefined') {
                hostname = window.location.hostname;
                preview = window.localStorage.getItem('aviationPreview') && window.localStorage.getItem('aviationPreview') == 'true';
            }

            let returnValue: boolean = eval('(function(){' + this._functionCode + '})()');

            if (isUndefined(returnValue)) {
               return false;
            }

            return returnValue;
        }

        return this._enabled;
    }
}