import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidPromotionBundlesIdException extends DomainException{
    constructor(id:string, quantity:number){
        super(`The bundle id ${id} is repeated ${quantity} ${quantity==1 ? 'time' :'times'} `)
    }
}