import { DomainEvent } from "src/common/domain";
import { PaymentMethodId } from "../value-objects/payment-method-id";
import { PaymentMethodState } from "../value-objects/payment-method-state";
import { AvailablePayment } from "./available-payment";

export class DisablePayment extends DomainEvent {
    
    serialize(): string {
        let data = {
            paymentMethodId: this.paymentMethodId.paymentMethodId,
            paymentMethodState: this.paymentMethodState.paymentMethodState
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public paymentMethodId: PaymentMethodId,
        public paymentMethodState: PaymentMethodState,
    ){
        super();
    }

    static create (
        id: PaymentMethodId,
        paymentMethodState: PaymentMethodState
    ){
        let paymentMethod = new AvailablePayment(
            id,
            paymentMethodState
        );
        return paymentMethod;
    }
}