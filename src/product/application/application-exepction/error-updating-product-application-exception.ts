import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatingProductApplicationException extends ApplicationException{
    constructor() {
        super('Error during updating of product');
    }}