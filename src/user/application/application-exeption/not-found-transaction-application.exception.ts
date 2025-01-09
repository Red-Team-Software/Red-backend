import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundTransactionApplicationException extends ApplicationException{
    constructor() {
        super('Error transactions not found');
    }
}