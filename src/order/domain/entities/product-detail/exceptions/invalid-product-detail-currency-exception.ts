import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidProductDetailCurrencyException extends DomainException{
    constructor(){
        super("The currency is not in the system")
    }
}