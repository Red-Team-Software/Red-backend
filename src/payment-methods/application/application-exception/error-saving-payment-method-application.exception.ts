import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorSavingPaymentMethodApplicationException extends ApplicationException{
    constructor() {
        super('Error during saving payment method');
    }
}