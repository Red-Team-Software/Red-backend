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
import { IGeocodification } from 'src/Order/domain/domain-services/geocodification-interface';
import { OrderAddressStreet } from 'src/Order/domain/value_objects/order-direction-street';
import { OrderProduct } from 'src/Order/domain/entities/order-product/order-product-entity';
import { OrderBundle } from 'src/Order/domain/entities/order-bundle/order-bundle-entity';
import { OrderProductId } from 'src/Order/domain/entities/order-product/value_object/order-productId';
import { ProductID } from '../../../product/domain/value-object/product-id';
import { OrderProductQuantity } from 'src/Order/domain/entities/order-product/value_object/order-Product-quantity';
import { OrderBundleId } from 'src/Order/domain/entities/order-bundle/value_object/order-bundlesId';
import { OrderBundleQuantity } from 'src/Order/domain/entities/order-bundle/value_object/order-bundle-quantity';
import { BundleId } from '../../../bundle/domain/value-object/bundle-id';


export class PayOrderAplicationService extends IApplicationService<OrderPayApplicationServiceRequestDto,OrderPayResponseDto>{
    
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly calculateShippingFee: ICalculateShippingFee,
        private readonly calculateTaxesFee: ICalculateTaxesFee,
        private readonly payOrder: IPaymentService,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly idGen: IIdGen<string>,
        private readonly geocodificationAddress: IGeocodification,
    ){
        super()
    }
    
    async execute(data: OrderPayApplicationServiceRequestDto): Promise<Result<OrderPayResponseDto>> {

            let order: Order;
        
            let products: OrderProduct[] = [];

            let bundles: OrderBundle[] = [];

            let orderAddress = OrderAddressStreet.create(data.address);
        
            // let address = await this.geocodificationAddress.DirecctiontoLatitudeLongitude(orderAddress);
            
            // let orderDirection = OrderDirection.create(address.getValue.Latitude, address.getValue.Longitude);

            let orderDirection = OrderDirection.create(10.4399, -66.89275);

            // let shippingFee = await this.calculateShippingFee.calculateShippingFee(orderDirection);

            let shippingFee = OrderShippingFee.create(10);

            // if (!shippingFee.isSuccess())
            //  return Result.fail(new ErrorObtainingShippingFeeApplicationException('Error obtaining shipping fee'));

            let amount = OrderTotalAmount.create(data.amount, data.currency);

            let taxes = await this.calculateTaxesFee.calculateTaxesFee(amount);

            if (!taxes.isSuccess()) 
                return Result.fail(new ErrorObtainingTaxesApplicationException('Error obtaining taxes'));
            
            //let amountTotal = amount.OrderAmount + shippingFee.getValue.OrderShippingFee + taxes.getValue.OrderTaxes;
            
            let amountTotal = amount.OrderAmount + shippingFee.OrderShippingFee + taxes.getValue.OrderTaxes;

            let total = OrderTotalAmount.create(amountTotal, data.currency);
            
            let orderPayment = OrderPayment.create(total.OrderAmount, total.OrderCurrency, data.paymentMethod);

            let stripePaymentMethod = OrderStripePaymentMethod.create(data.stripePaymentMethod);

            //let response = await this.payOrder.createPayment(orderPayment, stripePaymentMethod);

            //if (!response.isSuccess()) return Result.fail(new ErrorCreatingPaymentApplicationException('Error during creation of payment'));

            if (data.products)
                products=data.products.map(product=>OrderProduct.create(
                OrderProductId.create(ProductID.create(product.id)),
                OrderProductQuantity.create(product.quantity))
            )

            if (data.bundles)
                bundles=data.bundles.map(bundle=>
                    OrderBundle.create(
                        OrderBundleId.create(BundleId.create(bundle.id)),
                        OrderBundleQuantity.create(bundle.quantity)
                    )
            )


            order = Order.registerOrder(
                OrderId.create(await this.idGen.genId()),
                OrderState.create('ongoing'),
                OrderCreatedDate.create(new Date()),
                total,
                orderDirection,
                products,
                bundles,
                OrderReciviedDate.create(new Date()),
                undefined,
                orderPayment
            )
            
            let responseDB = await this.orderRepository.saveOrder(order); 

            if (!responseDB.isSuccess()) return Result.fail(new ErrorCreatingOrderApplicationException('Error during creation of order'));

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
                    data.products,
                    data.bundles,
                    order.OrderReciviedDate.OrderReciviedDate,
                    order.OrderReport?.OrderReportId,
                    payment
                )
            );
    }
}