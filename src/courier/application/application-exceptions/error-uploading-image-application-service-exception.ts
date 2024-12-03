import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUploadingCourierImageApplicationException extends ApplicationException{
    constructor() {
        super('Error uploading courier image');
    }
}