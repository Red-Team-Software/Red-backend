import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorCreatingPromotionApplicationException extends ApplicationException{
    constructor() {
        super('Error during creation of promotion');
    }}