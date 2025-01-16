import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class CuponUserInvalidUseApplicationException extends ApplicationException {
    constructor() {
        super('The coupon cannot be use by this user.');
    }
}
