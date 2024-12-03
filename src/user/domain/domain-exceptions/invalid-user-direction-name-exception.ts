import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserDirectionNameException extends DomainException{
    constructor(){super("The user direction name is ivalid")}
}