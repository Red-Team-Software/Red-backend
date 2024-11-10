import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";
import Stripe from "stripe";
import { OrderPayment } from "../../domain/value_objects/order-payment";
import { IPaymentService } from "../../domain/domain-services/payment-interface";


export class StripeConnection implements IPaymentService {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton
    ) {
        this.stripe = stripe;
    }

    async createPayment(pay: OrderPayment): Promise<boolean> {

        try{
            const payment = await this.stripe.stripeInstance.paymentIntents.create({
                amount: pay.Amount,
                currency: pay.Currency,
                payment_method: pay.PaymentMethod,
                
            });
            return true;
        } catch (error) {
            return false;
        }
        
    }
}