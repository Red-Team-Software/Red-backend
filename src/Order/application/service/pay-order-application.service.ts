import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { OrderPayApplicationServiceRequestDto } from '../dto/request/order-pay-request-dto';
import { OrderPayResponseDto } from '../dto/response/order-pay-response-dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { ICalculateShippingFee } from 'src/Order/domain/domain-services/calculate-shippping-fee.interfafe';
import { ICalculateTaxesFee } from 'src/Order/domain/domain-services/calculate-taxes-fee.interface';
import { OrderTotalAmount } from 'src/Order/domain/value_objects/order-totalAmount';
import { IPaymentService } from 'src/Order/domain/domain-services/payment-interface';
import { OrderPayment } from 'src/Order/domain/value_objects/order-payment';
import { OrderDirection } from 'src/Order/domain/value_objects/order-direction';
import { ErrorObtainingShippingFeeApplicationException } from '../application-exception/error-obtaining-shipping-fee.application.exception';
import { ErrorCreatingPaymentApplicationException } from '../application-exception/error-creating-payment-application.exception';
import { ErrorObtainingTaxesApplicationException } from '../application-exception/error-obtaining-taxes.application.exception';
import { OrderStripePaymentMethod } from 'src/Order/domain/value_objects/order-stripe-payment-method';
import { ICommandOrderRepository } from 'src/Order/domain/command-repository/order-command-repository-interface';
import { Order } from 'src/Order/domain/aggregate/order';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { OrderCreatedDate } from 'src/Order/domain/value_objects/order-created-date';
import { OrderId } from 'src/Order/domain/value_objects/orderId';
import { OrderState } from 'src/Order/domain/value_objects/orderState';
import { OrderShippingFee } from 'src/Order/domain/value_objects/order-shipping-fee';
import { OrderReciviedDate } from 'src/Order/domain/value_objects/order-recivied-date';
import { ErrorCreatingOrderApplicationException } from '../application-exception/error-creating-product-application.exception';


export class PayOrderAplicationService extends IApplicationService<OrderPayApplicationServiceRequestDto,OrderPayResponseDto>{
    
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly calculateShippingFee: ICalculateShippingFee,
        private readonly calculateTaxesFee: ICalculateTaxesFee,
        private readonly payOrder: IPaymentService,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly idGen: IIdGen<string>,
    ){
        super()
    }
    
    async execute(data: OrderPayApplicationServiceRequestDto): Promise<Result<OrderPayResponseDto>> {

            let orderDirection = OrderDirection.create(data.lat, data.long);

            //let shippingFee = await this.calculateShippingFee.calculateShippingFee(orderDirection);

            let shippingFee = OrderShippingFee.create(10);

            //if (!shippingFee.isSuccess) return Result.fail(new ErrorObtainingShippingFeeApplicationException('Error obtaining shipping fee'));

            let amount = OrderTotalAmount.create(data.amount, data.currency);

            let taxes = await this.calculateTaxesFee.calculateTaxesFee(amount);

            if (!taxes.isSuccess) return Result.fail(new ErrorObtainingTaxesApplicationException('Error obtaining taxes'));
            
            //let amountTotal = amount.OrderAmount + shippingFee.getValue.OrderShippingFee + taxes.getValue.OrderTaxes;
            
            let amountTotal = amount.OrderAmount + shippingFee.OrderShippingFee + taxes.getValue.OrderTaxes;

            let total = OrderTotalAmount.create(amountTotal, data.currency);
            
            let orderPayment = OrderPayment.create(total.OrderAmount, total.OrderCurrency, data.paymentMethod);

            let stripePaymentMethod = OrderStripePaymentMethod.create(data.stripePaymentMethod);

            //let response = await this.payOrder.createPayment(orderPayment, stripePaymentMethod);

            //if (!response.isSuccess) return Result.fail(new ErrorCreatingPaymentApplicationException('Error during creation of payment'));

            let order = Order.registerOrder(
                OrderId.create(await this.idGen.genId()),
                OrderState.create('ongoing'),
                OrderCreatedDate.create(new Date()),
                total,
                orderDirection,
                [],
                [],
                OrderReciviedDate.create(new Date()),
                undefined,
                orderPayment
            )

            let responseDB = await this.orderRepository.saveOrder(order);  

            if (!responseDB.isSuccess) return Result.fail(new ErrorCreatingOrderApplicationException('Error during creation of order'));

            await this.eventPublisher.publish(order.pullDomainEvents());

            let direction = {
                lat: order.OrderDirection.Latitude,
                long: order.OrderDirection.Longitude
            }

            let payment = {
                amount: order.OrderPayment.Amount,
                currency: order.OrderPayment.Currency,
                paymentMethod: order.OrderPayment.PaymentMethod
            }

            return Result.success(
                new OrderPayResponseDto(
                    order.getId().orderId,
                    order.OrderState.orderState,
                    order.OrderCreatedDate.OrderCreatedDate,
                    order.TotalAmount.OrderAmount,
                    order.TotalAmount.OrderCurrency,
                    direction,
                    [],
                    [],
                    order.OrderReciviedDate.OrderReciviedDate,
                    order.OrderReport?.OrderReportId,
                    payment
                )
            );
    }
}