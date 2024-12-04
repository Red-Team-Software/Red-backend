import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorModifingOrderDeliveryApplicationException extends ApplicationException{
    constructor() {
        super('Error during saving modification of order delivery location');
    }
}