import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorProductNameAlreadyExistApplicationException extends ApplicationException{
    constructor(name:string) {
        super(`Error product name already exist name that is already registered ${name}`);
    }}