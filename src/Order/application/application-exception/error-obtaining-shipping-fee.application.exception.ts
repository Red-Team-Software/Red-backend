import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorObtainingShippingFeeApplicationException extends ApplicationException{
    constructor() {
        super('Error obtaining shipping fee');
    }
}