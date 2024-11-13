import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBundleCurrencyException extends DomainException{
    constructor(){super("La moneda del bundle no esta en el sistema")}
}