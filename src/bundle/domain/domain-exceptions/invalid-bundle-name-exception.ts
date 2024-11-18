import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBundleNameException extends DomainException{
    constructor(){super("El nombre del bundle tiene que tener mas de 5 caracteres")}
}