import { DomainException } from "src/common/infraestructure/exceptions/domain-exception";

export class InvalidProductDescriptionException extends DomainException{
    constructor(){super("La descripcion del producto tiene que tener mas de 5 caracteres")}
}