import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundPaymentMethodApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error during the search of the payment method with id ${id}`);
    }
}