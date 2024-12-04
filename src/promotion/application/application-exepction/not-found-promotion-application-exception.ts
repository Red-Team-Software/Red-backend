import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundPromotionApplicationException extends ApplicationException{
    constructor(name:string) {
        super(`Error promotion term:${name} not found`);
    }}