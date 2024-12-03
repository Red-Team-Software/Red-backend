import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidPaymentMethodImageException extends DomainException{
    constructor(){super("The payment method image is invalid")}
}