import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingOrderCuponNotFoundApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of order cupon not found');
    }
}