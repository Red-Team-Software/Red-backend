import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidProductCurrencyException extends DomainException{
    constructor(){super("La moneda del producto no esta en el sistema")}
}