import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserNameException extends DomainException{
    constructor(){super("El nombre del usuario no es un nombre valido")}
}