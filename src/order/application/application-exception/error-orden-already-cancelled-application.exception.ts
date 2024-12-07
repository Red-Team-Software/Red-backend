import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorOrderAlreadyCancelledApplicationException extends ApplicationException{
    constructor(msg: string) {
        super(msg);
    }
}