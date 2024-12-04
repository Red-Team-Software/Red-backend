import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrrorSavingPushTokenApplicationException extends ApplicationException{
    constructor() {
        super('Error during saving push into the session, please try again');
    }}