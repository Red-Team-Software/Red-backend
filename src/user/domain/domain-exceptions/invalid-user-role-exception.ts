import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidUserRoleException extends DomainException{
    constructor(){super("El rol del usuario no es valido")}
}