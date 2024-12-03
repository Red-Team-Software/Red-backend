import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundCuponApplicationException extends ApplicationException {
    constructor() {
        super("The requested coupon was not found.");
    }
}
