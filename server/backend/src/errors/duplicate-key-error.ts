import {AviationError} from "./aviation-error";
import {MongoError} from "mongodb";

export class DuplicateKeyError extends AviationError {
    constructor(entityName: string, error: MongoError) {
        let field = error.message.match(/_?([a-zA-Z]*)_?\d?\s*dup key/i)[1];
        super(422, 1004, 'Can\'t save ' + entityName + ' as value of ' + field + ' is already in use but is supposed to be unique', field + ' of ' + entityName + ' already exists', {
            field: field}
            );
    }
}