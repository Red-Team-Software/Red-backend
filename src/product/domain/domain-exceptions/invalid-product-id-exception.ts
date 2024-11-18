import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidProductIdException extends DomainException{
    constructor(){super("El id del producto no es un UUID valido")}
}