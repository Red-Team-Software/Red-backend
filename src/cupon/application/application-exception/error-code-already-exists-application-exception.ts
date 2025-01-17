import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCodeAlreadyExistsCuponApplicationException extends ApplicationException{
    constructor() {
        super('Error, cupon code already exists');
    }}