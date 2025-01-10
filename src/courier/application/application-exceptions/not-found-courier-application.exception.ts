import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundCourierApplicationException extends ApplicationException{
    constructor() {
        super('Error during the search of the courier');
    }
}