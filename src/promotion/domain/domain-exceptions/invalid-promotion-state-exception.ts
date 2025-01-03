import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidPromotionStateException extends DomainException{
    constructor(state:string){
        super(`The promotion state is not valid state:${state}`)
    }
}