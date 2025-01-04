import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class UserAlreadyExistPhoneNumberApplicationException extends ApplicationException{
    constructor(phone: string){
        super(`User with phone number ${phone} already exists`);
    }
}