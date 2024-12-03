import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserRoleException extends DomainException{
    constructor(){super("El rol del usuario no es valido")}
}