import { DomainException } from "src/common/infraestructure/exceptions/domain-exception";

export class InvalidProductImageException extends DomainException{
    constructor(){super("La imagen del producto tiene que ser mayor que 5")}
}