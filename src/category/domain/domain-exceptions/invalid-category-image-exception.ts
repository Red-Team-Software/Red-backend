import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidCategoryImageException extends DomainException{
    constructor(){super("La imagen de la categoria es incorrecta")}
}