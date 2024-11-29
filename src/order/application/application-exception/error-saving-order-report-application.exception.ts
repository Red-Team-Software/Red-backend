import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorSavingOrderReportApplicationException extends ApplicationException{
    constructor() {
        super('Error during saving report');
    }
}