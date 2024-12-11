import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserDirectionIdException extends DomainException{
    constructor(){super("The user direction id is not an UUID valid")}
}