import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundProductApplicationException extends ApplicationException{
    constructor() {
        super('Error during searching bundles');
    }}