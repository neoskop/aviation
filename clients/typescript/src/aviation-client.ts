import {AviationFeature} from "./model/aviation-feature";
import {LoadingFailedError} from "./error/loading-failed-error";
import {FeatureUnmanagedError} from "./error/feature-unmanaged-error";
import * as request from "superagent";
import {AviationConnectionInfo} from "./aviation-connection-info";
import {AviationFeatureMonitor} from "./aviation-feature-monitor";
import {AviationCache} from "./model/aviation-cache";

export class AviationClient {
    static _featureCaches: Object = {};
    private _meta: any;
    private _connectionInfo: AviationConnectionInfo;
    private _cachingTime: number;

    constructor(endpointUrl: string, token: string, cachingTime: number = 3600, meta?: any, webSocketEnabled = true) {
        this._cachingTime = cachingTime;
        this._connectionInfo = new AviationConnectionInfo(endpointUrl, token);
        this._meta = meta;

        if (webSocketEnabled) {
            AviationFeatureMonitor.subscribe(this);
        }
    }

    public async feature(name: string): Promise<AviationFeature> {
        if (AviationClient._featureCaches[this._connectionInfo.key] == null || AviationClient._featureCaches[this._connectionInfo.key].isStale()) {
            let res = await request
                .get(this._connectionInfo.url + '/features')
                .set('Authorization', 'Bearer ' + this._connectionInfo.token)
                .set('Accept', 'application/json')
                .accept('json');

                if (res.status == 200) {
                    let featureMap: Object = {};

                    res.body.forEach((f: any) => {
                        let feature: AviationFeature = new AviationFeature(f);
                        featureMap[feature.name] = feature;
                    });

                    AviationClient._featureCaches[this._connectionInfo.key] = new AviationCache(featureMap, this._cachingTime);
                } else {
                    throw new LoadingFailedError(res.body);
                }
        }

        if (AviationClient._featureCaches[this._connectionInfo.key] != null && AviationClient._featureCaches[this._connectionInfo.key].has(name)) {
            return AviationClient._featureCaches[this._connectionInfo.key].get(name);
        }

        return Promise.reject(new FeatureUnmanagedError());
    }

    get connectionInfo(): AviationConnectionInfo {
        return this._connectionInfo;
    }

    public updateFeature(updatedFeature: AviationFeature) {
        let featureCache: AviationCache = AviationClient._featureCaches[this._connectionInfo.key];
        featureCache.update(updatedFeature);
    }
}