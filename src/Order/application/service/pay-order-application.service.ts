import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { OrderPayApplicationServiceRequestDto } from '../dto/request/order-pay-request-dto';
import { OrderPayResponseDto } from '../dto/response/order-pay-response-dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { ICalculateShippingFee } from 'src/order/domain/domain-services/calculate-shippping-fee.interfafe';
import { ICalculateTaxesFee } from 'src/order/domain/domain-services/calculate-taxes-fee.interface';
import { OrderTotalAmount } from 'src/order/domain/value_objects/order-totalAmount';
import { IPaymentService } from 'src/order/domain/domain-services/payment-interface';
import { OrderDirection } from 'src/order/domain/value_objects/order-direction';
import { ErrorObtainingShippingFeeApplicationException } from '../application-exception/error-obtaining-shipping-fee.application.exception';
import { ErrorCreatingPaymentApplicationException } from '../application-exception/error-creating-payment-application.exception';
import { ErrorObtainingTaxesApplicationException } from '../application-exception/error-obtaining-taxes.application.exception';
import { OrderStripePaymentMethod } from 'src/order/domain/value_objects/order-stripe-payment-method';
import { ICommandOrderRepository } from 'src/order/domain/command-repository/order-command-repository-interface';
import { Order } from 'src/order/domain/aggregate/order';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { OrderCreatedDate } from 'src/order/domain/value_objects/order-created-date';
import { OrderId } from 'src/order/domain/value_objects/orderId';
import { OrderState } from 'src/order/domain/value_objects/orderState';
import { OrderShippingFee } from 'src/order/domain/value_objects/order-shipping-fee';
import { OrderReceivedDate } from 'src/order/domain/value_objects/order-received-date';
import { ErrorCreatingOrderApplicationException } from '../application-exception/error-creating-order-application.exception';
import { IGeocodification } from 'src/order/domain/domain-services/geocodification-interface';
import { OrderAddressStreet } from 'src/order/domain/value_objects/order-direction-street';
import { OrderProduct } from 'src/order/domain/entities/order-product/order-product-entity';
import { OrderBundle } from 'src/order/domain/entities/order-bundle/order-bundle-entity';
import { OrderProductId } from 'src/order/domain/entities/order-product/value_object/order-productId';
import { ProductID } from '../../../product/domain/value-object/product-id';
import { OrderProductQuantity } from 'src/order/domain/entities/order-product/value_object/order-product-quantity';
import { OrderBundleId } from 'src/order/domain/entities/order-bundle/value_object/order-bundlesId';
import { OrderBundleQuantity } from 'src/order/domain/entities/order-bundle/value_object/order-bundle-quantity';
import { BundleId } from '../../../bundle/domain/value-object/bundle-id';
import { IProductRepository } from 'src/product/domain/repository/product.interface.repositry';
import { IBundleRepository } from 'src/bundle/domain/repository/product.interface.repositry';
import { Product } from 'src/product/domain/aggregate/product.aggregate';
import { ErrorCreatingOrderProductNotFoundApplicationException } from '../application-exception/error-creating-order-product-not-found-application.exception';
import { ErrorCreatingOrderBundleNotFoundApplicationException } from '../application-exception/error-creating-order-bundle-not-found-application.exception';
import { Bundle } from 'src/bundle/domain/aggregate/bundle.aggregate';
import { OrderReport } from 'src/order/domain/entities/report/report-entity';
import { OrderPayment } from 'src/order/domain/entities/payment/order-payment-entity';
import { PaymentId } from 'src/order/domain/entities/payment/value-object/payment-id';
import { PaymentMethod } from 'src/order/domain/entities/payment/value-object/payment-method';
import { PaymentAmount } from 'src/order/domain/entities/payment/value-object/payment-amount';
import { PaymentCurrency } from 'src/order/domain/entities/payment/value-object/payment-currency';


export class PayOrderAplicationService extends IApplicationService<OrderPayApplicationServiceRequestDto,OrderPayResponseDto>{
    
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly calculateShippingFee: ICalculateShippingFee,
        private readonly calculateTaxesFee: ICalculateTaxesFee,
        private readonly payOrder: IPaymentService,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly idGen: IIdGen<string>,
        private readonly geocodificationAddress: IGeocodification,
        private readonly productRepository:IProductRepository,
        private readonly bundleRepository:IBundleRepository
    ){
        super()
    }
    
    async execute(data: OrderPayApplicationServiceRequestDto): Promise<Result<OrderPayResponseDto>> {

        let products:Product[]=[]
        let bundles:Bundle[]=[]
        let orderproducts: OrderProduct[] = []
        let orderBundles: OrderBundle[] = [];

        if(data.products){
            for (const product of data.products){
                let domain=await this.productRepository.findProductById(ProductID.create(product.id))

                if(!domain.isSuccess())
                    return Result.fail(new ErrorCreatingOrderProductNotFoundApplicationException())

                products.push(domain.getValue)
            }
            
            if (data.products)
                orderproducts=data.products.map(product=>OrderProduct.create(
                OrderProductId.create(product.id),
                OrderProductQuantity.create(product.quantity))
            )

        }

        if(data.bundles){
            for (const bundle of data.bundles){
                let domain=await this.bundleRepository.findBundleById(BundleId.create(bundle.id))

                if(!domain.isSuccess())
                    return Result.fail(new ErrorCreatingOrderBundleNotFoundApplicationException())
                bundles.push(domain.getValue)
            }

            if (data.bundles)
                orderBundles=data.bundles.map(bundle=>
                    OrderBundle.create(
                        OrderBundleId.create(BundleId.create(bundle.id)),
                        OrderBundleQuantity.create(bundle.quantity)
                    )
            )
        }

            let orderAddress = OrderAddressStreet.create(data.address);
        
            // let address = await this.geocodificationAddress.DirecctiontoLatitudeLongitude(orderAddress);
            
            // let orderDirection = OrderDirection.create(address.getValue.Latitude, address.getValue.Longitude);

            let orderDirection = OrderDirection.create(10.4399, -66.89275);

            // let shippingFee = await this.calculateShippingFee.calculateShippingFee(orderDirection);

            let shippingFee = OrderShippingFee.create(10);

            // if (!shippingFee.isSuccess())
            //  return Result.fail(new ErrorObtainingShippingFeeApplicationException());

            let amount = OrderTotalAmount.create(data.amount, data.currency);

            let taxes = await this.calculateTaxesFee.calculateTaxesFee(amount);

            if (!taxes.isSuccess()) 
                return Result.fail(new ErrorObtainingTaxesApplicationException());
            
            //let amountTotal = amount.OrderAmount + shippingFee.getValue.OrderShippingFee + taxes.getValue.OrderTaxes;
            
            let amountTotal = amount.OrderAmount + shippingFee.OrderShippingFee + taxes.getValue.OrderTaxes;

            let total = OrderTotalAmount.create(amountTotal, data.currency);
            
            let orderPayment = OrderPayment.create(
                PaymentId.create(await this.idGen.genId()),
                PaymentMethod.create(data.paymentMethod),
                PaymentAmount.create(total.OrderAmount),
                PaymentCurrency.create(total.OrderCurrency)
            );

            let stripePaymentMethod = OrderStripePaymentMethod.create(data.stripePaymentMethod);

            let response = await this.payOrder.createPayment(orderPayment, stripePaymentMethod);

            if (!response.isSuccess()) return Result.fail(new ErrorCreatingPaymentApplicationException());

            let orderReceivedDate: OrderReceivedDate = null;
            let orderReport: OrderReport = null;
            
            let order = Order.registerOrder(
                OrderId.create(await this.idGen.genId()),
                OrderState.create('ongoing'),
                OrderCreatedDate.create(new Date()),
                total,
                orderDirection,
                orderproducts,
                orderBundles,
                orderReceivedDate, 
                orderReport, 
                orderPayment
            );
            
            let responseDB = await this.orderRepository.saveOrder(order); 

            if (!responseDB.isSuccess()) 
                return Result.fail(new ErrorCreatingOrderApplicationException());

            await this.eventPublisher.publish(order.pullDomainEvents());

            let productsresponse:{
                id: string,
                quantity: number
                nombre:string 
                descripcion:string
                price:number 
                images:string[]
                currency:string
            }[]=[]

            let bundlesresponse:{
                id: string,
                quantity: number
                nombre:string 
                descripcion:string
                price:number 
                currency:string
                images:string[]
            }[]=[]


            products.forEach(product=>{
                productsresponse.push({
                    id: product.getId().Value,
                    quantity: order.Products.find(
                        orderproduct=>product.getId().equals(ProductID.create(orderproduct.OrderProductId.OrderProductId))
                    ).Quantity.Quantity,
                    nombre:product.ProductName.Value,
                    descripcion:product.ProductDescription.Value,
                    price:product.ProductPrice.Price,
                    currency:product.ProductPrice.Currency,
                    images:product.ProductImages.map(image=>image.Value)
                })
            })

            bundles.forEach(bundle=>{
                bundlesresponse.push({
                    id: bundle.getId().Value,
                    quantity: order.Bundles.find(
                        orderBundle=>orderBundle.getId().OrderBundleId.equals(bundle.getId())
                    ).Quantity.OrderBundleQuantity,
                    nombre:bundle.BundleName.Value ,
                    descripcion:bundle.BundleDescription.Value,
                    price:bundle.BundlePrice.Price,
                    currency:bundle.BundlePrice.Currency,
                    images:bundle.BundleImages.map(image=>image.Value)                
                })
            })
            

            let responsedata:OrderPayResponseDto={
                id: order.getId().orderId,
                orderState: order.OrderState.orderState,
                orderCreatedDate: order.OrderCreatedDate.OrderCreatedDate,
                totalAmount: order.TotalAmount.OrderAmount,
                currency: order.TotalAmount.OrderCurrency,
                orderDirection: {
                    lat: order.OrderDirection.Latitude,
                    long: order.OrderDirection.Longitude
                },
                products:productsresponse,
                bundles:bundlesresponse,
                orderPayment: {
                    amount: order.OrderPayment.PaymentAmount.Value,
                    currency: order.OrderPayment.PaymentCurrency.Value,
                    paymentMethod: order.OrderPayment.PaymentMethods.Value
                }
            }


            return Result.success(responsedata);
    }
}