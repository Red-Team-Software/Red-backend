import { Result } from "src/common/utils/result-handler/result";
import { OrderStripePaymentMethod } from "../value_objects/order-stripe-payment-method";
import { OrderPayment } from "../entities/payment/order-payment-entity";

export interface IPaymentService{
    createPayment(pay: OrderPayment, stripePaymentMethod: OrderStripePaymentMethod): Promise<Result<string>>;
}