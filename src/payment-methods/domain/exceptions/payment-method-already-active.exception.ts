import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class PaymentMethodAlreadyActiveException extends DomainException{
    constructor(){super("Payment method is already active")}
}