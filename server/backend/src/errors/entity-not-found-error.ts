import {AviationError} from "./aviation-error";

export class EntityNotFoundError extends AviationError {
    constructor(entityName: string, keyName?: string) {
        super(404, 1002, entityName + " not found by key " + (keyName == null ? 'name' : keyName), entityName + " not found");
    }
}