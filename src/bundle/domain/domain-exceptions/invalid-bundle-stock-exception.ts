import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBundleStockException extends DomainException{
    constructor(){super("La cantidad de stock del bundle tiene que ser mayor que cero")}
}