import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundleCurrencyException extends DomainException{
    constructor(){super("La moneda del bundle no esta en el sistema")}
}