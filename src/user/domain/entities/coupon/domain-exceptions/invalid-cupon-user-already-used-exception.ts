import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponUserAlreadyUsedException extends DomainException {
    constructor() {
        super(`The cupon is already used by the user`);
    }
}
