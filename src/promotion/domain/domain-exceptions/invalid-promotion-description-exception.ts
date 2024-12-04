import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidPromotionDescriptionException extends DomainException{
    constructor(description:string){
        super(`The promotion description is not valid ${description}`)
    }
}