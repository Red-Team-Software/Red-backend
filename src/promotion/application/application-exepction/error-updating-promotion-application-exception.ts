import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatingPromotionApplicationException extends ApplicationException{
    constructor(id:string) {
        super('Error updating promotion');
    }
}