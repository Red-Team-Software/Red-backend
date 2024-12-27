import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorDeletingImagesApplicationException extends ApplicationException{
    constructor() {
        super('Error deleting the images');
    }
}