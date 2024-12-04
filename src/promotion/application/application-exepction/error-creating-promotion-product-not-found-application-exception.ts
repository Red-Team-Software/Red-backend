import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingPromotionProductNotFoudApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error during creation of promotion product id:${id} not found`);
    }}