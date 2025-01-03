import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundleProductsIdException extends DomainException{
    constructor(id:string, quantity:number){
        super(`The product id ${id} is repeated ${quantity} ${quantity==1 ? 'time' :'times'} `)
    }
}