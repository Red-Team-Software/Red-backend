import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidProductDetailPriceException extends DomainException{
    constructor(){
        super("The price cannot be less than zero")
    }
}