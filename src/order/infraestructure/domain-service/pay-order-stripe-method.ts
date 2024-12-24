import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton";
import { IPaymentMethodService } from "../../domain/domain-services/payment-method-interface";
import { Result } from "src/common/utils/result-handler/result";
import { OrderPayment } from "src/order/domain/entities/payment/order-payment-entity";
import { Order } from "src/order/domain/aggregate/order";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { PaymentId } from "src/order/domain/entities/payment/value-object/payment-id";
import { PaymentMethod } from "src/order/domain/entities/payment/value-object/payment-method";
import { PaymentAmount } from "src/order/domain/entities/payment/value-object/payment-amount";
import { PaymentCurrency } from "src/order/domain/entities/payment/value-object/payment-currency";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";


export class StripePayOrderMethod implements IPaymentMethodService {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton,
        private readonly idGen: IIdGen<string>,
        private readonly stripePaymentMethod: string
    ) {
        this.stripe = stripe;
    }

    async createPayment(order: Order): Promise<Result<Order>> {
        try {
            const paymentIntent =
                await this.stripe.stripeInstance.paymentIntents.create({
                    amount: Math.round(order.TotalAmount.OrderAmount*100),
                    currency: order.TotalAmount.OrderCurrency,
                    payment_method_types: ['card'],
                    confirmation_method: 'manual',
                    metadata: { orderId: order.getId().orderId },
                });
            let paymentIntentId = paymentIntent.id;
            
            const confirmedPaymentIntent =
                await this.stripe.stripeInstance.paymentIntents.confirm(
                    paymentIntentId,
                    {
                        payment_method: this.stripePaymentMethod,
                    },
                );

            let orderPayment: OrderPayment = OrderPayment.create(
                PaymentId.create(await this.idGen.genId()),
                PaymentMethod.create('card'),
                PaymentAmount.create(order.TotalAmount.OrderAmount),
                PaymentCurrency.create(order.TotalAmount.OrderCurrency)
            );

            let newOrder = Order.registerOrder(
                order.getId(),
                OrderState.create('ongoing'),
                order.OrderCreatedDate,
                order.TotalAmount,
                order.OrderDirection,
                order.OrderCourier,
                order.OrderUserId,
                order.Products,
                order.Bundles,
                order.OrderReceivedDate, 
                order.OrderReport, 
                orderPayment
            );
            
            return Result.success(newOrder);
        } catch (error) {
            return Result.fail(error);
        }
        
    }
}