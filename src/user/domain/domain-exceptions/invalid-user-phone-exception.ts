import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserPhoneException extends DomainException{
    constructor(){super("El telefono del usuario no es un telefono valido")}
}