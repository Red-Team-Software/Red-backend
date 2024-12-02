import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatinngUserAccountApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error updation user account with user id:${id}`);
    }}