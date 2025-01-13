import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidDirectionIdException extends DomainException{
    constructor(){super("The id of direction is not a UUID valid")}
}