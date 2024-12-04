import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingPromotionBundleNotFoudApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error during creation of promotion bundle id:${id} not found`);
    }}