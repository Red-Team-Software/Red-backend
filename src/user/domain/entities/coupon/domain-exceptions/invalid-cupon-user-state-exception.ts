import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponUserStateException extends DomainException {
    constructor(state:string) {
        super(`The cupon user state :${state} Cupon State is invalid.`);
    }
}
