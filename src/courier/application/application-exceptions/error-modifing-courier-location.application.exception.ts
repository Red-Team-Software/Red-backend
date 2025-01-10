import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorModifingCourierApplicationException extends ApplicationException{
    constructor() {
        super('Error during saving modification of courier location');
    }
}