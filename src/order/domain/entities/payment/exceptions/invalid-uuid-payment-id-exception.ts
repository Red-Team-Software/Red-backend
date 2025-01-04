import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidOrderProductIdException extends DomainException{
    constructor(){super("The product id is not a valid UUID")}
}