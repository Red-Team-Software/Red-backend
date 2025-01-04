import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundBundleApplicationException extends ApplicationException{
    constructor() {
        super('Error during searching bundles');
    }}