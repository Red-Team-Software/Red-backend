import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorOrderAlreadyCanceledApplicationException extends ApplicationException{
    constructor() {
        super('The order is already canceled');
    }
}