import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBundleMeasurementException extends DomainException{
    constructor(){super("La unidad del peso no esta en el sistema")}
}