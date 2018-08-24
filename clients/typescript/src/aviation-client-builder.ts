import {AviationClient} from "./aviation-client";

export function aviation() {
    return new AviationClientBuilder();
}

export class AviationClientBuilder {
    private _endpointUrl: string;
    private _token: string;
    private _meta: any = {};
    private _cacheTime: number = 3600;
    private _webSocketEnabled: boolean = true;

    public endpoint(endpointUrl: string): AviationClientBuilder  {
        this._endpointUrl = endpointUrl;
        return this;
    }

    public token(token: string): AviationClientBuilder {
        this._token = token;
        return this;
    }

    public cache(cacheTime: number): AviationClientBuilder {
        this._cacheTime = cacheTime;
        return this;
    }

    public meta(meta: any): AviationClientBuilder {
        this._meta = meta;
        return this;
    }

    public websocket(webSocketEnabled: boolean): AviationClientBuilder {
        this._webSocketEnabled = webSocketEnabled;
        return this;
    }

    public mix(): AviationClient {
        return new AviationClient(this._endpointUrl, this._token, this._cacheTime, this._meta, this._webSocketEnabled);
    }
}