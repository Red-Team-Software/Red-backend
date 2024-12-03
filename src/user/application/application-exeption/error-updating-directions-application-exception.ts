import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatinDirectionApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error updation user direction user with id:${id}`);
    }}