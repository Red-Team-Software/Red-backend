import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundleStockException extends DomainException{
    constructor(number:number){
        super(`La cantidad de stock del bundle tiene que ser mayor que cero, pero se recibio ${number}`)
    }
}