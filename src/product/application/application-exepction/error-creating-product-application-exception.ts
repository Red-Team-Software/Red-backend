import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingProductApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of product');
    }}