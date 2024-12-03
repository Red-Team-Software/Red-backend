import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundOrderApplicationException extends ApplicationException{
    constructor() {
        super('Error during the search of the orders');
    }
}