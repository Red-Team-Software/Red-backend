export class ErrorUploadingImagesApplicationException extends Error {
    constructor() {
        super('Error uploading images for category.');
        this.name = 'ErrorUploadingImagesApplicationException';
    }
}