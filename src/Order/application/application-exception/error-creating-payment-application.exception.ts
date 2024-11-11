import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingPaymentApplicationException extends ApplicationException{
    constructor(msg: string) {
        super(msg);
    }
}