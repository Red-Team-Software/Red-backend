import { IApplicationService} from 'src/common/application/services';
import { PayOrder } from '../../domain/domain-events/pay-order';
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

            let shippingFee = await this.calculateShippingFee.calculateShippingFee(orderDirection);

            if (!shippingFee.isSuccess) return Result.fail(new ErrorObtainingShippingFeeApplicationException('Error obtaining shipping fee'));

            let amount = OrderTotalAmount.create(data.amount, data.currency);

            let taxes = await this.calculateTaxesFee.calculateTaxesFee(amount);

            if (!taxes.isSuccess) return Result.fail(new ErrorObtainingTaxesApplicationException('Error obtaining taxes'));
            
            let monto = amount.OrderAmount + shippingFee.getValue.OrderShippingFee + taxes.getValue.OrderTaxes;
            
            let total = OrderTotalAmount.create(monto, data.currency);
            
            let orderPayment = OrderPayment.create(total.OrderAmount, total.OrderCurrency, data.paymentMethod);

            let stripePaymentMethod = OrderStripePaymentMethod.create(data.stripePaymentMethod);

            let response = await this.payOrder.createPayment(orderPayment, stripePaymentMethod);

            if (!response.isSuccess) return Result.fail(new ErrorCreatingPaymentApplicationException('Error during creation of payment'));

            //TODO: Crear la orden

            let order = Order.registerOrder(
                OrderId.create(await this.idGen.genId()),
                OrderState.create('ongoing'),
                OrderCreatedDate.create(new Date()),
                total,
                orderDirection,
                [],
                [],
                null,
                null,
                orderPayment
            )
            console.log('Order: ', order);
            //await this.orderRepository.saveOrder(order);  

            return Result.success(new OrderPayResponseDto(response.getValue));
    }
}