import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingOrderProductNotFoundApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of order product not foud');
    }
}