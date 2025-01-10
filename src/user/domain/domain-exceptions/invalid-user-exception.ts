import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidUserException extends DomainException{
    constructor(){super("The user is not valid")}
}