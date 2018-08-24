import {AviationFeature} from "./aviation-feature";

export class AviationCache {
    private _featureMap: Object;
    private _cachingTime: number;
    private _featureLoadingTime: number;

    constructor(featureMap: Object, cachingTime: number) {
        this._featureMap = featureMap;
        this._cachingTime = cachingTime;
        this._featureLoadingTime = new Date().getTime();
    }

    public get(name: string): AviationFeature {
        return this._featureMap[name];
    }

    public has(name: string): boolean {
        return this._featureMap[name] != null;
    }

    public update(value: AviationFeature) {
        this._featureMap[value.name] = value;
    }

    public isStale(): boolean {
        return this._featureLoadingTime + this._cachingTime * 1000 <= new Date().getTime();
    }
}