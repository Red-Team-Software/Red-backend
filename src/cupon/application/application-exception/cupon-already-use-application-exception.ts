import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class CuponAlreadyUsedException extends ApplicationException {
    constructor() {
        super('The coupon has already been used by this user.');
    }
}
