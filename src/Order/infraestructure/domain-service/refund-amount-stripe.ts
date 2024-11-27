import { Result } from "src/common/utils/result-handler/result";
import { IRefundPaymentService } from "src/order/domain/domain-services/refund-amount.interface";
import { OrderStripePaymentIntent } from "src/order/domain/value_objects/order-stripe-payment-intent";
import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";

export class RefundPaymentStripeConnection implements IRefundPaymentService {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton
    ) {
        this.stripe = stripe;
    }

    async refundPayment(stripePaymentIntent: OrderStripePaymentIntent): Promise<Result<string>> {
        try {
            const refund = await this.stripe.stripeInstance.refunds.create({
                payment_intent: stripePaymentIntent.paymentIntent,
            });
            return Result.success(refund.status);
        } catch (error) {
            return Result.fail(error);
        }
    }
}