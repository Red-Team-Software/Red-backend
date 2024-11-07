import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidProductNameException extends DomainException{
    constructor(){super("El nombre del producto tiene que tener mas de 5 caracteres")}
}