import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class EmptyPaymentMethodNameException extends DomainException{
    constructor(){super("The payment method name is empty")}
}