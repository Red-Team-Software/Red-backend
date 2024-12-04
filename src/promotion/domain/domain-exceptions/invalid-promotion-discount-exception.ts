import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidPromotionDiscountException extends DomainException{
    constructor(discount:number){
        super(`The promotion discount is not valid discount:${discount}`)
    }
}