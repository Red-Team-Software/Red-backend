import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidUserEmailException extends DomainException{
    constructor(){super("El email del usuario no es un email valido")}
}