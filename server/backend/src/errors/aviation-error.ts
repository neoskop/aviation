import { Response } from 'express-serve-static-core';

export abstract class AviationError {
    private _httpCode: number;
    private _internalCode: number;
    private _developerMessage: string;
    private _userMessage: string;
    private _additional: any;

    constructor(httpCode: number, internalCode: number, developerMessage: string, userMessage: string, additional?: any) {
        this._httpCode = httpCode;
        this._internalCode = internalCode;
        this._developerMessage = developerMessage;
        this._userMessage = userMessage;
        this._additional = additional;
    }

    get httpCode(): number {
        return this._httpCode;
    }

    get internalCode(): number {
        return this._internalCode;
    }

    get developerMessage(): string {
        return this._developerMessage;
    }

    get userMessage(): string {
        return this._userMessage;
    }

    get additional(): any {
        return this._additional;
    }

    respond(res: Response): any {
        res.status(this._httpCode).json({
            error: {
                internalCode: this._internalCode,
                userMessage: this._userMessage,
                developerMessage: this._developerMessage,
                additionalInformation: this._additional
            }
        });
    }
}