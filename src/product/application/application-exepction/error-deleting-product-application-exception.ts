import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorDeletingProductApplicationException extends ApplicationException{
    constructor() {
        super('Error during deleting of product');
    }}