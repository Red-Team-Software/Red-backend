import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingCuponApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of cupon');
    }}