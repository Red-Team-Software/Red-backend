import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorPaymentMethodInactiveApplicationException extends ApplicationException{
    constructor() {
        super('Payment method is inactive');
    }
}