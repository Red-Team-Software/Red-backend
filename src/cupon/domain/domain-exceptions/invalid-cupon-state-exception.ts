import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponStateException extends DomainException {
    constructor(state:string) {
        super(`The state :${state} Cupon State is invalid.`);
    }
}
