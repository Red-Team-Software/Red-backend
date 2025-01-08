import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCourierException extends DomainException{
    constructor(){super("The courier is invalid, information is missing")}
}