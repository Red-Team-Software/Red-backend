import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserImageException extends DomainException{
    constructor(){super("La imagen del usuario no es un valido")}
}