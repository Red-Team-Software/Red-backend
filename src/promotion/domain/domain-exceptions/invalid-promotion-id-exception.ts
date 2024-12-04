import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidPromotionIdException extends DomainException{
    constructor(){
        super("The id of the promotion is not an UUID valid ")
    }
}