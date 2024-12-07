import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorOrderAlreadyCanceledApplicationException extends ApplicationException{
    constructor(msg: string) {
        super(msg);
    }
}