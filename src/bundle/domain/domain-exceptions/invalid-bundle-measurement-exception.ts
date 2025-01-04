import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundleMeasurementException extends DomainException{
    constructor(){super("La unidad del peso no esta en el sistema")}
}