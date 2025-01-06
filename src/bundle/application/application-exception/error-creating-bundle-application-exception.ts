import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingBundleApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of bundle');
    }}