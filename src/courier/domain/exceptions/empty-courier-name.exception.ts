import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class EmptyCourierNameException extends DomainException{
    constructor(){super("The courier name can not be empty")}
}