import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundlePriceException extends DomainException{
    constructor(){super("La cantidad del precio del bundle tiene que ser mayor que cero")}
}