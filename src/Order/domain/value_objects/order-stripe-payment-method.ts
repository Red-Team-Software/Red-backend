import { ValueObject } from "src/common/domain";

export class OrderStripePaymentMethod extends ValueObject<OrderStripePaymentMethod> {
    private PaymentMethod: string;

    private constructor(PaymentMethod: string) {
        super();

        this.PaymentMethod = PaymentMethod;
    }

    equals(obj: OrderStripePaymentMethod): boolean {
        return this.PaymentMethod == obj.PaymentMethod;
    }

    get paymentMethod() {
        return this.PaymentMethod;
    }

    public static create(PaymentMethod: string): OrderStripePaymentMethod {
        return new OrderStripePaymentMethod(PaymentMethod);
    }
}