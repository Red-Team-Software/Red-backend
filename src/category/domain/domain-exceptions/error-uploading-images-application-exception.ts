import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class ErrorUploadingImagesApplicationException extends DomainException {
    constructor() {
        super('Error uploading images for category.');
        this.name = 'ErrorUploadingImagesApplicationException';
    }
}