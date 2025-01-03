import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatingBundleApplicationException extends ApplicationException{
    constructor() {
        super('Error during updating of bundle');
    }}