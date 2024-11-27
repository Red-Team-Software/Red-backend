import { Result } from "src/common/utils/result-handler/result";
import { OrderStripePaymentIntent } from "../value_objects/order-stripe-payment-intent";

export interface IRefundPaymentService{
    refundPayment(stripePaymentIntent: OrderStripePaymentIntent): Promise<Result<string>>;
}