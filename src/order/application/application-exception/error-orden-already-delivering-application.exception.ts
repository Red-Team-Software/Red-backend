import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorOrderAlreadyDeliveringApplicationException extends ApplicationException{
    constructor() {
        super('The order is already delivering');
    }
}