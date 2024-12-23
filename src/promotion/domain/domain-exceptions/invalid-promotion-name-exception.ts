import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidPromotionNameException extends DomainException{
    constructor(name:string){
        super(`The promotion name is not valid name:${name}`)
    }
}