import {AviationError} from "./aviation-error";

export class EntityInvalidError extends AviationError {
    constructor(entityName: string, ...mandatoryFields: string[]) {
        super(422, 1003, entityName + " is invalid." + (mandatoryFields.length > 0 ? ' Mandatory fields: ' + mandatoryFields.join(', ') : ''), entityName + " is invalid");
    }
}