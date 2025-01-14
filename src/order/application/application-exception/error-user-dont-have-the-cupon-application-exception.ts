import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUserDontHaveTheCuponApplicationException extends ApplicationException{
    constructor() {
        super('User dont have the cupon to apply');
    }}