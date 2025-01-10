import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundleWeigthException extends DomainException{
    constructor(){super("La unidad del peso debe ser mayor que cero")}
}