import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton";
import { Result } from "src/common/utils/result-handler/result";
import { OrderPayment } from "src/order/domain/entities/payment/order-payment-entity";
import { Order } from "src/order/domain/aggregate/order";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { PaymentId } from "src/order/domain/entities/payment/value-object/payment-id";
import { PaymentMethod } from "src/order/domain/entities/payment/value-object/payment-method";
import { PaymentAmount } from "src/order/domain/entities/payment/value-object/payment-amount";
import { PaymentCurrency } from "src/order/domain/entities/payment/value-object/payment-currency";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IPaymentMethodService } from "src/order/domain/domain-services/interfaces/payment-method-interface";
import { PaymentFailedException } from "src/order/domain/exception/domain-services/payment-failed-exception";
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface";
import { IAccount } from "src/auth/application/model/account.interface";


export class StripePayOrderMethod implements IPaymentMethodService {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton,
        private readonly idGen: IIdGen<string>,
        private readonly stripePaymentMethod: string,
        private readonly accountRepository:IQueryAccountRepository<IAccount>
    ) {
        this.stripe = stripe;
    }

    async createPayment(order: Order): Promise<Result<Order>> {
        try {
            
            let userAccount = await this.accountRepository.findAccountByUserId(order.OrderUserId.userId);

            let user = userAccount.getValue;
            
            const paymentIntent =
                await this.stripe.stripeInstance.paymentIntents.create({
                    amount: Math.round(order.TotalAmount.OrderAmount*100),
                    currency: order.TotalAmount.OrderCurrency,
                    payment_method_types: ['card'],
                    confirmation_method: 'manual',
                    customer: user.idStripe,
                    metadata: { orderId: order.getId().orderId },
                });
            let paymentIntentId = paymentIntent.id;

            console.log(paymentIntentId);
            
            const confirmedPaymentIntent =
                await this.stripe.stripeInstance.paymentIntents.confirm(
                    paymentIntentId,
                    {
                        payment_method: this.stripePaymentMethod
                    }
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
                order.OrderUserId,
                order.OrderCuponId,
                order.OrderCourierId,
                order.Products,
                order.Bundles,
                order.OrderReceivedDate, 
                order.OrderReport, 
                orderPayment
            );
            
            return Result.success(newOrder);
        } catch (error) {
            console.log(error);
            return Result.fail(new PaymentFailedException());
        }
        
    }
}