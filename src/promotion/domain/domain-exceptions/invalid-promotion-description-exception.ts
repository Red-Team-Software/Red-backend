import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidPromotionDescriptionException extends DomainException{
    constructor(description:string){
        super(`The promotion description is not valid ${description}`)
    }
}