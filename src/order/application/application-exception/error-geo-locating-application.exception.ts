import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorGeolocationApplicationException extends ApplicationException{
    constructor() {
        super('Error during geolocation');
    }
}