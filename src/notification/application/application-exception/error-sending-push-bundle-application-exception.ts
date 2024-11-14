import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorSendingPushBundleApplicationException extends ApplicationException{
    constructor() {
        super('Error during sending push to users of a new Bundle');
    }}