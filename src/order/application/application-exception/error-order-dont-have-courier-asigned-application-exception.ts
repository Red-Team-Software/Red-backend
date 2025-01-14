import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorOrderDontHaveCourierAssignedApplicationException extends ApplicationException{
    constructor() {
        super('Order dont have courier assigned');
    }}