import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserEmailException extends DomainException{
    constructor(){super("El email del usuario no es un email valido")}
}