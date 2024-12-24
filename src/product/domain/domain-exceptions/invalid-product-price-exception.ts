import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidProductPriceException extends DomainException{
    constructor(){super("La cantidad del precio del producto tiene que ser mayor que cero")}
}