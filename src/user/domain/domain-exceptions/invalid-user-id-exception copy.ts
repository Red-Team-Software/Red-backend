import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserIdException extends DomainException{
    constructor(){super("El id del usuario no es un UUID valido")}
}