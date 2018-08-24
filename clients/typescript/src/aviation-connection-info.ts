export class AviationConnectionInfo {
    private _url: string;
    private _token: String;

    constructor(url: string, token: String) {
        this._url = url;
        this._token = token;
    }

    get url(): string {
        return this._url;
    }

    get token(): String {
        return this._token;
    }

    get sioUrl(): string {
        return this._url + '/?auth_token=' + this._token;
    }

    get key(): string {
        return this.sioUrl;
    }
}