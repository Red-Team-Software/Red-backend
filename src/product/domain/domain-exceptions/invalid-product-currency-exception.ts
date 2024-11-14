import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidProductCurrencyException extends DomainException{
    constructor(){super("La moneda del producto no esta en el sistema")}
}