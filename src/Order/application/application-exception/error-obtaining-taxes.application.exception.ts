import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorObtainingTaxesApplicationException extends ApplicationException{
    constructor(msg: string) {
        super(msg);
    }
}