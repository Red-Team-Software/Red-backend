import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class EmptyCourierNameException extends DomainException{
    constructor(){super("The courier name can not be empty")}
}