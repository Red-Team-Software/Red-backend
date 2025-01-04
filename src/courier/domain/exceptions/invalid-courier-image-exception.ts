import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCourierImageException extends DomainException{
    constructor(){super("The delivery image is invalid")}
}