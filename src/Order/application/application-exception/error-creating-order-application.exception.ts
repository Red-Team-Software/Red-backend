import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingOrderApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of order');
    }
}