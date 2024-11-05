import { DomainException } from "src/common/infraestructure/exceptions/domain-exception";

export class InvalidProductPriceException extends DomainException{
    constructor(){super("La cantidad del precio del producto tiene que ser mayor que cero")}
}