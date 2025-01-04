import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorBundleNameAlreadyApplicationException extends ApplicationException{
    constructor(name:string) {
        super(`Error bundle name already exist, ${name}`);
    }}