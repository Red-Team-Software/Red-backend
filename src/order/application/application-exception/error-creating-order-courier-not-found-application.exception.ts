import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingOrderCourierNotFoundApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of order, couriers not foud');
    }
}