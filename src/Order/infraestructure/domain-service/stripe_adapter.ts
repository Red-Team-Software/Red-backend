import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";
import Stripe from "stripe";
import { OrderPayment } from "../../domain/value_objects/order-payment";
import { IPaymentService } from "../../domain/domain-services/payment-interface";
import { Result } from "src/common/utils/result-handler/result";
import { OrderStripePaymentMethod } from "src/Order/domain/value_objects/order-stripe-payment-method";


export class StripeConnection implements IPaymentService {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton
    ) {
        this.stripe = stripe;
    }

    async createPayment(pay: OrderPayment, stripePaymentMethod: OrderStripePaymentMethod): Promise<Result<string>> {
        try {
            const paymentIntent =
                await this.stripe.stripeInstance.paymentIntents.create({
                    amount: pay.Amount,
                    currency: pay.Currency,
                    payment_method_types: ['card'],
                    confirmation_method: 'manual',
                });
            let paymentIntentId = paymentIntent.id;
            
            const confirmedPaymentIntent =
                await this.stripe.stripeInstance.paymentIntents.confirm(
                    paymentIntentId,
                    {
                        payment_method: stripePaymentMethod.paymentMethod,
                    },
                );
            return Result.success(confirmedPaymentIntent.status);
        } catch (error) {
            return Result.fail(error);
        }
        
    }
}