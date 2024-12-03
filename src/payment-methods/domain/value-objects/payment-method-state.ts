import { ValueObject } from "src/common/domain";
import { PaymentMethodStateEnum } from "./enum/enum-payment-method-state";
import { InvalidPaymentMethodStateException } from "../exceptions/invalid-payment-method-state-exception";

export class PaymentMethodState extends ValueObject<PaymentMethodState> {
    private state: string;

    private constructor(state: string) {
        super();

        if( PaymentMethodStateEnum.active != state 
            && PaymentMethodStateEnum.inactive != state
        ) { throw new InvalidPaymentMethodStateException()}  

        this.state = state;
    }

    equals(obj: PaymentMethodState): boolean {
        return this.state == obj.state;
    }

    get paymentMethodState() {
        return this.state;
    }

    public static create(state: string): PaymentMethodState {
        return new PaymentMethodState(state);
    }
}