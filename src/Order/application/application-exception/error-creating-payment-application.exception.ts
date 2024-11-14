import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingPaymentApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of payment');
    }
}