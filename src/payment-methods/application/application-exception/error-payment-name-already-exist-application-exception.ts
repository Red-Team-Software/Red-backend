import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorPaymentNameAlreadyApplicationException extends ApplicationException{
    constructor(name:string) {
        super(`Error payment name already exist, ${name}`);
    }}