import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidProductIdException extends DomainException{
    constructor(){super("El id del producto no es un UUID valido")}
}