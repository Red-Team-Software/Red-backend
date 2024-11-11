import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBundleException extends DomainException{
    constructor(){super("La bundle es invalido")}
}