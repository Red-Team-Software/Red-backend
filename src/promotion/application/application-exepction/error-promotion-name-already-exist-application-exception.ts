import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorPromotionNameAlreadyApplicationException extends ApplicationException{
    constructor(name:string) {
        super(`Error promotion name:${name} already exist`);
    }}