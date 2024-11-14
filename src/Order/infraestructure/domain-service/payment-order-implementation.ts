import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";
import Stripe from "stripe";
import { OrderPayment } from "../../domain/value_objects/order-payment";
import { IPaymentService } from "../../domain/domain-services/payment-interface";
import { Result } from "src/common/utils/result-handler/result";
import { OrderStripePaymentMethod } from "src/Order/domain/value_objects/order-stripe-payment-method";

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