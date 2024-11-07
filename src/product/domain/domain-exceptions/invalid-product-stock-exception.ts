import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidProductStockException extends DomainException{
    constructor(){super("La cantidad de stock del producto tiene que ser mayor que cero")}
}