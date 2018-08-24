import {AviationClient} from "./aviation-client";
import {AviationSocket} from "./model/aviation-socket";

export class AviationFeatureMonitor {
    private static _subscribers: Array<AviationClient> = [];
    private static _connections: Object = {};

    public static subscribe(client: AviationClient) {
        this._subscribers.push(client);

        if (this._connections[client.connectionInfo.key] == null) {
            this._connections[client.connectionInfo.key] = new AviationSocket(client.connectionInfo, updatedFeature => {
                this._subscribers.forEach((s) => {
                    if (s.connectionInfo == client.connectionInfo) {
                        s.updateFeature(updatedFeature);
                    }
                });
            });
        }
    }
}