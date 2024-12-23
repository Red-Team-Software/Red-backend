import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidProductImageException extends DomainException{
    constructor(){super("La imagen del producto tiene que ser mayor que 5")}
}