import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { PaymentMethodId } from "../value-objects/payment-method-id";
import { DomainEvent } from "src/common/domain";
import { PaymentMethodName } from "../value-objects/payment-method-name";
import { PaymentMethodState } from "../value-objects/payment-method-state";
import { MissingPaymentMethodAtributes } from "../exceptions/missing-payment-method-atributes.exception";
import { PaymentMethodRegistered } from "../domain-events/payment-method-registered";


export class PaymentMethodAgregate extends AggregateRoot <PaymentMethodId>{
    
    protected when(event: DomainEvent): void {
        if (event instanceof PaymentMethodRegistered) {
            this.paymentMethodName = event.paymentMethodName;
            this.paymentMethodState = event.paymentMethodState;
        };
    };
    protected validateState(): void {
        if (!this.paymentMethodName || 
            !this.paymentMethodName ||
            !this.paymentMethodState
        ) throw new MissingPaymentMethodAtributes();
        
    };

    private constructor(
        paymentMethodId:PaymentMethodId,
        private paymentMethodName: PaymentMethodName,
        private paymentMethodState: PaymentMethodState
    ){
        super(paymentMethodId)
    }
    
    static RegisterPaymentMethod(
        paymentMethodId:PaymentMethodId,
        paymentMethodName:PaymentMethodName,
        paymentMethodState:PaymentMethodState
    ):PaymentMethodAgregate{
        const paymentMethod = new PaymentMethodAgregate(
            paymentMethodId,
            paymentMethodName,
            paymentMethodState
        );
        paymentMethod.apply(
            new PaymentMethodRegistered(
                paymentMethodId,
                paymentMethodState,
                paymentMethodName
            )
        );
        return paymentMethod;
    }

    static initializeAgregate(
        paymentMethodId:PaymentMethodId,
        paymentMethodName:PaymentMethodName,
        paymentMethodState:PaymentMethodState
    ):PaymentMethodAgregate{
        return new PaymentMethodAgregate(
            paymentMethodId,
            paymentMethodName,
            paymentMethodState
        );
    }
    

    get name(){
        return this.paymentMethodName;
    }

    get state(){
        return this.paymentMethodState;
    }
}