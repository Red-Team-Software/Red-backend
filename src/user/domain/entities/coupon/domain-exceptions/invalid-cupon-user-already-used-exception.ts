import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponUserAlreadyUsedException extends DomainException {
    constructor() {
        super(`The cupon user is already used`);
    }
}
