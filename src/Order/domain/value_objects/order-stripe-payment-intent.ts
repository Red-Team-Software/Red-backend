import { ValueObject } from "src/common/domain";

export class OrderStripePaymentIntent extends ValueObject<OrderStripePaymentIntent> {
    private PaymentIntent: string;

    private constructor(PaymentIntent: string) {
        super();

        this.PaymentIntent = PaymentIntent;
    }

    equals(obj: OrderStripePaymentIntent): boolean {
        return this.PaymentIntent == obj.PaymentIntent;
    }

    get paymentIntent() {
        return this.PaymentIntent;
    }

    public static create(PaymentIntent: string): OrderStripePaymentIntent {
        return new OrderStripePaymentIntent(PaymentIntent);
    }
}