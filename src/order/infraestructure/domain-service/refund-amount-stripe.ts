import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { IRefundPaymentService } from "src/order/domain/domain-services/interfaces/refund-amount.interface";
import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton";

export class RefundPaymentStripeConnection implements IRefundPaymentService {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton
    ) {
        this.stripe = stripe;
    }

    async refundPayment(order: Order): Promise<Result<string>> {
        try {

            const paymentIntents = await this.stripe.stripeInstance.paymentIntents.list({});

            const stripePaymentIntent = paymentIntents.data.find(
                (paymentIntent) => paymentIntent.metadata.orderId === order.getId().orderId,
            );

            const refund = await this.stripe.stripeInstance.refunds.create({
                payment_intent: stripePaymentIntent.id,
            });
            return Result.success(refund.status);
        } catch (error) {
            return Result.fail(error);
        }
    }
}