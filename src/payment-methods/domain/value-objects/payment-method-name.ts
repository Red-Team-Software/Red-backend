import { ValueObject } from "src/common/domain";
import { EmptyPaymentMethodNameException } from "../exceptions/empty-payment-method-name.exception";


export class PaymentMethodName extends ValueObject<PaymentMethodName> {
    private name: string;

    private constructor(name: string) {
        super();

        if ( !name )throw new EmptyPaymentMethodNameException();

        this.name = name;
    }

    equals(obj: PaymentMethodName): boolean {
        return this.name == obj.name;
    }

    get paymentMethodName() {
        return this.name;
    }

    public static create(name: string): PaymentMethodName {
        return new PaymentMethodName(name);
    }
}