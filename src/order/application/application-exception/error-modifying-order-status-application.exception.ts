import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorModifiyingOrderStateApplicationException extends ApplicationException{
    constructor() {
        super('Error during modifiying order state');
    }
}