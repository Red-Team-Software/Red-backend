import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCategoryProductNotFoudApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error during creation of category product id:${id} not found`);
    }}