import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorChangeCurrencyApplicationException extends ApplicationException{
    constructor() {
        super('The change currency have an error');
    }}