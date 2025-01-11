import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { PaymentMethodId } from "../value-objects/payment-method-id";
import { DomainEvent } from "src/common/domain";
import { PaymentMethodName } from "../value-objects/payment-method-name";
import { PaymentMethodState } from "../value-objects/payment-method-state";
import { MissingPaymentMethodAtributes } from "../exceptions/missing-payment-method-atributes.exception";
import { PaymentMethodRegistered } from "../domain-events/payment-method-registered";
import { PaymentMethodImage } from "../value-objects/payment-method-image";
import { AvailablePayment } from "../domain-events/available-payment";
import { DisablePayment } from "../domain-events/disable-payment";


export class PaymentMethodAgregate extends AggregateRoot <PaymentMethodId>{
    
    protected when(event: DomainEvent): void {
        if (event instanceof PaymentMethodRegistered) {
            this.paymentMethodName = event.paymentMethodName;
            this.paymentMethodState = event.paymentMethodState;
            this.paymentMethodImage = event.paymentMethodImage;
        };
        if (event instanceof AvailablePayment) {
            this.paymentMethodState = event.paymentMethodState;
        }
        if(event instanceof DisablePayment){
            this.paymentMethodState = event.paymentMethodState;
        }
    };
    protected validateState(): void {
        if (!this.paymentMethodName || 
            !this.paymentMethodState ||
            !this.paymentMethodImage
        ) throw new MissingPaymentMethodAtributes();
        
    };

    private constructor(
        paymentMethodId:PaymentMethodId,
        private paymentMethodName: PaymentMethodName,
        private paymentMethodState: PaymentMethodState,
        private paymentMethodImage: PaymentMethodImage
    ){
        super(paymentMethodId)
    }
    
    static RegisterPaymentMethod(
        paymentMethodId:PaymentMethodId,
        paymentMethodName:PaymentMethodName,
        paymentMethodState:PaymentMethodState,
        paymentMethodImage: PaymentMethodImage
    ):PaymentMethodAgregate{
        const paymentMethod = new PaymentMethodAgregate(
            paymentMethodId,
            paymentMethodName,
            paymentMethodState,
            paymentMethodImage
        );
        paymentMethod.apply(
            new PaymentMethodRegistered(
                paymentMethodId,
                paymentMethodState,
                paymentMethodName,
                paymentMethodImage
            )
        );
        return paymentMethod;
    }

    static initializeAgregate(
        paymentMethodId:PaymentMethodId,
        paymentMethodName:PaymentMethodName,
        paymentMethodState:PaymentMethodState,
        paymentMethodImage: PaymentMethodImage
    ):PaymentMethodAgregate{
        return new PaymentMethodAgregate(
            paymentMethodId,
            paymentMethodName,
            paymentMethodState,
            paymentMethodImage
        );
    }

    avaliablePayment():void{
        this.apply(
            AvailablePayment.create(
                this.getId(),
                this.paymentMethodState.active()
            )
        )
    }
    
    disablePayment():void{
        this.apply(
            DisablePayment.create(
                this.getId(),
                this.paymentMethodState.inactive()
            )
        );
    }

    get name(){
        return this.paymentMethodName;
    }

    get state(){
        return this.paymentMethodState;
    }

    get image(){
        return this.paymentMethodImage;
    }
}