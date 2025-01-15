import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class CuponAlreadyUnavaleableException extends DomainException {
    constructor() {
        super(`The Cupon is already unavaleable.`);
    }
}
