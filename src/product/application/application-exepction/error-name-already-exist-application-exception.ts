import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorNameAlreadyApplicationException extends ApplicationException{
    constructor() {
        super('Error product name already exist');
    }}