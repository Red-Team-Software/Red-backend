import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorNameAlreadyApplicationException extends ApplicationException {
    constructor() {
        super('A category with this name already exists.');
        this.name = 'ErrorNameAlreadyApplicationException';
    }
}
