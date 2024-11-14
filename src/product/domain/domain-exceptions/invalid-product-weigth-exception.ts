import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidProductWeigthException extends DomainException{
    constructor(){super("La unidad del peso debe ser mayor que cero")}
}