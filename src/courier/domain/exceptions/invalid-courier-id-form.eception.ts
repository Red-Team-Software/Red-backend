import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCourierIdException extends DomainException{
    constructor(){super("The courier id is nots a valid UUID")}
}