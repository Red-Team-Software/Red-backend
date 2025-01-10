import { Result } from "src/common/utils/result-handler/result";
import { OrderPayment } from "src/order/domain/entities/payment/order-payment-entity";
import { Order } from "src/order/domain/aggregate/order";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { PaymentId } from "src/order/domain/entities/payment/value-object/payment-id";
import { PaymentMethod } from "src/order/domain/entities/payment/value-object/payment-method";
import { PaymentAmount } from "src/order/domain/entities/payment/value-object/payment-amount";
import { PaymentCurrency } from "src/order/domain/entities/payment/value-object/payment-currency";
import { IPaymentMethodService } from "src/order/domain/domain-services/interfaces/payment-method-interface";


export class PayOrderMockMethod implements IPaymentMethodService {    

    
    constructor() {}

    async createPayment(order: Order): Promise<Result<Order>> {
        try {

            let orderPayment: OrderPayment = OrderPayment.create(
                PaymentId.create("df5d05fc-b6dd-4a93-8784-c7249f50d424"),
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