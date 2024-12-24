import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidProductStockException extends DomainException{
    constructor(){super("La cantidad de stock del producto tiene que ser mayor que cero")}
}