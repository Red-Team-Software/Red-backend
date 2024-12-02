import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatinngUserApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error updation user with id:${id}`);
    }}