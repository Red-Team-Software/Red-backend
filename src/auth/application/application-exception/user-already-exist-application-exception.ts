import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class UserAlreadyExistApplicationException extends ApplicationException{
    constructor(email: string){
        super(`User with email ${email} already exists`);
    }
}