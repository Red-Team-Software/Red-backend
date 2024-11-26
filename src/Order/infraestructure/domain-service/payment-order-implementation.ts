import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";
import Stripe from "stripe";
import { IPaymentService } from "../../domain/domain-services/payment-interface";
import { Result } from "src/common/utils/result-handler/result";
import { OrderStripePaymentMethod } from "src/order/domain/value_objects/order-stripe-payment-method";
import { OrderPayment } from "src/order/domain/entities/payment/order-payment-entity";

export class PaymentOrderImplementation implements IPaymentService {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton
    ) {
        this.stripe = stripe;
    }

    async createPayment(pay: OrderPayment, stripePaymentMethod: OrderStripePaymentMethod): Promise<Result<string>> {
        return Result.success("success"); 
    }
}