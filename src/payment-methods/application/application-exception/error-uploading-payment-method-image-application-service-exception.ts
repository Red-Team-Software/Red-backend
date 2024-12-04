import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUploadingPaymentMethodImageApplicationException extends ApplicationException{
    constructor() {
        super('Error uploading payment method image');
    }
}