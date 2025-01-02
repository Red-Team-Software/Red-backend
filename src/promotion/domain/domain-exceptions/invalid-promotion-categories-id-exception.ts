import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidPromotionCategoriesIdException extends DomainException{
    constructor(id:string, quantity:number){
        super(`The category id ${id} is repeated ${quantity} ${quantity==1 ? 'time' :'times'} `)
    }
}