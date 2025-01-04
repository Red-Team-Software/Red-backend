import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidUserIdException extends DomainException{
    constructor(){super("El id del usuario no es un UUID valido")}
}