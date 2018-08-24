import {AviationError} from "./aviation-error";

export class EntityAlreadyExistsError extends AviationError {
    constructor(entityName: string) {
        super(422, 1001, entityName + " with same name already exists", entityName + " already exists");
    }
}