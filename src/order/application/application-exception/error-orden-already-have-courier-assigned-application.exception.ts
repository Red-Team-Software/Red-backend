import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorOrderAlreadyHaveCourierAssignedApplicationException extends ApplicationException{
    constructor() {
        super('The order already have a courier assigned');
    }
}