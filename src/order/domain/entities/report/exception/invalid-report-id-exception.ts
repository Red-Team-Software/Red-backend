import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidOrderReportIdException extends DomainException{
    constructor(){super("The provided report ID is not a valid UUID.");}

}