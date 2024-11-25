import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingCourierApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of courier');
    }
}