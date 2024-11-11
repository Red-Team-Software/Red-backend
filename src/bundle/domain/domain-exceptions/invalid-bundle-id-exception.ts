import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBundleIdException extends DomainException{
    constructor(){super("El id del combo del producto no es un UUID valido")}
}