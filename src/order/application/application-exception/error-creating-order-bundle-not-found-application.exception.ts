import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingOrderBundleNotFoundApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of order bundle not found');
    }
}