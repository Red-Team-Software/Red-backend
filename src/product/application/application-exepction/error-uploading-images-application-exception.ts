import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUploadingImagesApplicationException extends ApplicationException{
    constructor() {
        super('Error uploading products images');
    }}