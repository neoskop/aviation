import {AviationConnectionInfo} from "../aviation-connection-info";
import {AviationFeature} from "./aviation-feature";
import * as io from 'socket.io-client';

export class AviationSocket {
    private _socket: SocketIOClient.Socket;
    private _connectionInfo: AviationConnectionInfo;
    private _featureConsumer: (updateFeature: AviationFeature) => void;

    constructor(connectionInfo: AviationConnectionInfo, featureConsumer: (updateFeature: AviationFeature) => void) {
        this._connectionInfo = connectionInfo;
        this._featureConsumer = featureConsumer;
        this.start();
    }

    private start() {
        this._socket = io.connect(this._connectionInfo.sioUrl);
        this._socket.on('featureUpdate', (data: any) => {
            let updatedFeature: AviationFeature = JSON.parse(data);
            this._featureConsumer(updatedFeature);
        });
    }
}
