import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingOrderReportApplicationException extends ApplicationException{
    constructor() {
        super('Unable to create order report because the order status is not canceled.');
    }
}