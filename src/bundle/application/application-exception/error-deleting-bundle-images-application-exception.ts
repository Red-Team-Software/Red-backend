import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorDeletingBundleImagesApplicationException extends ApplicationException{
    constructor() {
        super('Error deleting the bundle images');
    }
}