import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidOrderReportIdException extends DomainException{
    constructor(){super("The provided report ID is not a valid UUID.");}

}