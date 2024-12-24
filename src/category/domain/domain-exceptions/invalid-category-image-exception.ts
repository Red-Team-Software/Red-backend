import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCategoryImageException extends DomainException{
    constructor(){super("La imagen de la categoria es incorrecta")}
}