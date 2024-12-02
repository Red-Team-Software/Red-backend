import { Result } from "src/common/utils/result-handler/result";
import { OrderStripePaymentIntent } from "../value_objects/order-stripe-payment-intent";
import { Order } from "../aggregate/order";

export interface IRefundPaymentService{
    refundPayment(order: Order): Promise<Result<string>>;
}