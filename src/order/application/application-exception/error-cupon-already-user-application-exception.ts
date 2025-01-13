import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCuponAlreadyUsedApplicationException extends ApplicationException{
    constructor() {
        super('The cupon is already used');
    }}