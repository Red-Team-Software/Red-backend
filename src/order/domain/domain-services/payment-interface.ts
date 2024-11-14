import { Result } from "src/common/utils/result-handler/result";
import { OrderPayment } from "../value_objects/order-payment";
import { OrderStripePaymentMethod } from "../value_objects/order-stripe-payment-method";

export interface IPaymentService{
    createPayment(pay: OrderPayment, stripePaymentMethod: OrderStripePaymentMethod): Promise<Result<string>>;
}