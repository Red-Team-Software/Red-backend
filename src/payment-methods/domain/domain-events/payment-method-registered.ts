import { DomainEvent } from "src/common/domain";
import { PaymentMethodId } from "../value-objects/payment-method-id";
import { PaymentMethodState } from "../value-objects/payment-method-state";
import { PaymentMethodName } from "../value-objects/payment-method-name";
import { PaymentMethodImage } from "../value-objects/payment-method-image";


export class PaymentMethodRegistered extends DomainEvent {
    
    serialize(): string {
        let data = {
            paymentMethodId: this.paymentMethodId.paymentMethodId,
            paymentMethodState: this.paymentMethodState.paymentMethodState,
            paymentMethodName: this.paymentMethodName.paymentMethodName,
            paymentMethodImage: this.paymentMethodImage.Value
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public paymentMethodId: PaymentMethodId,
        public paymentMethodState: PaymentMethodState,
        public paymentMethodName: PaymentMethodName,
        public paymentMethodImage: PaymentMethodImage
    ){
        super();
    }

    static create (
        id: PaymentMethodId,
        paymentMethodState: PaymentMethodState,
        paymentMethodName: PaymentMethodName,
        paymentMethodImage: PaymentMethodImage
    ){
        let paymentMethod = new PaymentMethodRegistered(
            id,
            paymentMethodState,
            paymentMethodName,
            paymentMethodImage
        );
        return paymentMethod;
    }

    

}