import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidOrderProductIdException extends DomainException{
    constructor(){super("The product id is not a valid UUID")}
}