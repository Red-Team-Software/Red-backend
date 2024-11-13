import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBundleDescriptionException extends DomainException{
    constructor(){super("La descripcion del bundle tiene que tener mas de 5 caracteres")}
}