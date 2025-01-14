import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCuponUnavaleableApplicationException extends ApplicationException{
    constructor() {
        super('The cupon is unavaleable');
    }}