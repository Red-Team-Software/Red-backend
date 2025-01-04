import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundleImageException extends DomainException{
    constructor(){super("La imagen del Bundle tiene que ser mayor que 5")}
}