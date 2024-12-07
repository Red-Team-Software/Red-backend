import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { OrderPayApplicationServiceRequestDto } from '../dto/request/order-pay-request-dto';
import { OrderPayResponseDto } from '../dto/response/order-pay-response-dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { ICalculateShippingFee } from 'src/order/domain/domain-services/calculate-shippping-fee.interfafe';
import { ICalculateTaxesFee } from 'src/order/domain/domain-services/calculate-taxes-fee.interface';
import { OrderTotalAmount } from 'src/order/domain/value_objects/order-totalAmount';
import { IPaymentMethodService } from 'src/order/domain/domain-services/payment-method-interface';
import { OrderDirection } from 'src/order/domain/value_objects/order-direction';
import { ErrorCreatingPaymentApplicationException } from '../application-exception/error-creating-payment-application.exception';
import { ErrorObtainingTaxesApplicationException } from '../application-exception/error-obtaining-taxes.application.exception';
import { ICommandOrderRepository } from 'src/order/domain/command-repository/order-command-repository-interface';
import { Order } from 'src/order/domain/aggregate/order';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { OrderCreatedDate } from 'src/order/domain/value_objects/order-created-date';
import { OrderId } from 'src/order/domain/value_objects/order-id';
import { OrderState } from 'src/order/domain/value_objects/order-state';
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
import { Product } from 'src/product/domain/aggregate/product.aggregate';
import { ErrorCreatingOrderProductNotFoundApplicationException } from '../application-exception/error-creating-order-product-not-found-application.exception';
import { ErrorCreatingOrderBundleNotFoundApplicationException } from '../application-exception/error-creating-order-bundle-not-found-application.exception';
import { Bundle } from 'src/bundle/domain/aggregate/bundle.aggregate';
import { OrderReport } from 'src/order/domain/entities/report/report-entity';
import { OrderPayment } from 'src/order/domain/entities/payment/order-payment-entity';
import { CalculateAmount } from 'src/order/domain/domain-services/calculate-amount';
import { ICourierQueryRepository } from 'src/courier/application/query-repository/courier-query-repository-interface';
import { OrderCourier } from 'src/order/domain/entities/order-courier/order-courier-entity';
import { OrderCourierId } from 'src/order/domain/entities/order-courier/value-object/order-courier-id';
import { OrderCourierDirection } from 'src/order/domain/entities/order-courier/value-object/order-courier-direction';
import { OrderUserId } from 'src/order/domain/value_objects/order-user-id';
import { IDateHandler } from 'src/common/application/date-handler/date-handler.interface';
import { ErrorCreatingOrderCourierNotFoundApplicationException } from '../application-exception/error-creating-order-courier-not-found-application.exception';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { IQueryPromotionRepository } from 'src/promotion/application/query-repository/promotion.query.repository.interface';
import { Promotion } from 'src/promotion/domain/aggregate/promotion.aggregate';
import { FindAllPromotionApplicationRequestDTO } from 'src/promotion/application/dto/request/find-all-promotion-application-request-dto';
import { ErrorObtainingShippingFeeApplicationException } from '../application-exception/error-obtaining-shipping-fee.application.exception';
import { IPaymentMethodQueryRepository } from 'src/payment-methods/application/query-repository/orm-query-repository.interface';
import { PaymentMethodId } from 'src/payment-methods/domain/value-objects/payment-method-id';


export class PayOrderAplicationService extends IApplicationService<OrderPayApplicationServiceRequestDto,OrderPayResponseDto>{
    
    private readonly calculateAmount = new CalculateAmount();

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly calculateShippingFee: ICalculateShippingFee,
        private readonly calculateTaxesFee: ICalculateTaxesFee,
        private readonly payOrder: IPaymentMethodService,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly idGen: IIdGen<string>,
        private readonly geocodificationAddress: IGeocodification,
        private readonly productRepository:IQueryProductRepository,
        private readonly bundleRepository:IQueryBundleRepository,
        private readonly ormCourierQueryRepository: ICourierQueryRepository,
        private readonly dateHandler: IDateHandler,
        private readonly queryPromotionRepositoy: IQueryPromotionRepository,
        private readonly paymentQueryRepository:IPaymentMethodQueryRepository
        
    ){
        super()
    }
    
    async execute(data: OrderPayApplicationServiceRequestDto): Promise<Result<OrderPayResponseDto>> {

        let products:Product[]=[];
        let bundles:Bundle[]=[];
        let orderproducts: OrderProduct[] = [];
        let orderBundles: OrderBundle[] = [];
        let promotions: Promotion[] = [];

        let paymentResponse=await this.paymentQueryRepository.findMethodById(PaymentMethodId.create(data.paymentId))

        console.log(paymentResponse)

        if (!paymentResponse.isSuccess())
            return Result.fail(paymentResponse.getError)


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
                        OrderBundleId.create(bundle.id),
                        OrderBundleQuantity.create(bundle.quantity)
                    )
            )
        }

        let findPromotion: FindAllPromotionApplicationRequestDTO = {
            userId: data.userId,
            name: '',
            perPage: 1000,
            page: 0
        }

        let promoResponse = await this.queryPromotionRepositoy.findAllPromotion(findPromotion);

        if (promoResponse.isSuccess()) promotions = promoResponse.getValue;

        let amount = this.calculateAmount.calculateAmount(
            products,
            bundles,
            orderproducts,
            orderBundles,
            promotions,
            data.currency
        );

            let orderAddress = OrderAddressStreet.create(data.address);
        
            let address = await this.geocodificationAddress.DirecctiontoLatitudeLongitude(orderAddress);
            
            let orderDirection = OrderDirection.create(address.getValue.Latitude, address.getValue.Longitude);

            //let orderDirection = OrderDirection.create(10.4399, -66.89275);

            let shippingFee = await this.calculateShippingFee.calculateShippingFee(orderDirection);

            //let shippingFee = OrderShippingFee.create(10);

            if (!shippingFee.isSuccess())
                return Result.fail(new ErrorObtainingShippingFeeApplicationException());

            let taxes = await this.calculateTaxesFee.calculateTaxesFee(amount);

            if (!taxes.isSuccess()) 
                return Result.fail(new ErrorObtainingTaxesApplicationException());
            
            let amountTotal = amount.OrderAmount + shippingFee.getValue.OrderShippingFee + taxes.getValue.OrderTaxes;
            
            //let amountTotal = amount.OrderAmount + shippingFee.OrderShippingFee + taxes.getValue.OrderTaxes;

            let total = OrderTotalAmount.create(amountTotal, data.currency);
            
            let orderPayment: OrderPayment;

            let orderReceivedDate: OrderReceivedDate = null;
            let orderReport: OrderReport = null;

            let courier = await this.ormCourierQueryRepository.findAllCouriers();

            if (!courier.isSuccess()) return Result.fail(
                new ErrorCreatingOrderCourierNotFoundApplicationException()
            )

            if (courier.getValue.length==0) return Result.fail(
                new ErrorCreatingOrderCourierNotFoundApplicationException()
            )

            let selectedCourierId = courier.getValue[Math.floor(Math.random() * courier.getValue.length)].getId();

            let orderCourier = OrderCourier.create(
                OrderCourierId.create(selectedCourierId.courierId),
                OrderCourierDirection.create(10.4944, -66.8901)
            );

            let orderUserId: OrderUserId = OrderUserId.create(data.userId);
            
            let order = Order.initializeAggregate(
                OrderId.create(await this.idGen.genId()),
                OrderState.create('waiting'),
                OrderCreatedDate.create(this.dateHandler.currentDate()),
                total,
                orderDirection,
                orderCourier,
                orderUserId,
                orderproducts,
                orderBundles,
                orderReceivedDate, 
                orderReport, 
                orderPayment
            );

            let response = await this.payOrder.createPayment(order);

            if (response.isFailure()) return Result.fail(new ErrorCreatingPaymentApplicationException());
            
            let responseDB = await this.orderRepository.saveOrder(response.getValue); 

            if (responseDB.isFailure()) 
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
            }[]=[];

            let bundlesresponse:{
                id: string,
                quantity: number
                nombre:string 
                descripcion:string
                price:number 
                currency:string
                images:string[]
            }[]=[];


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
            });

            bundles.forEach(bundle=>{
                bundlesresponse.push({
                    id: bundle.getId().Value,
                    quantity: order.Bundles.find(
                        orderBundle=>bundle.getId().equals(BundleId.create(orderBundle.OrderBundleId.OrderBundleId))
                    ).Quantity.OrderBundleQuantity,
                    nombre:bundle.BundleName.Value ,
                    descripcion:bundle.BundleDescription.Value,
                    price:bundle.BundlePrice.Price,
                    currency:bundle.BundlePrice.Currency,
                    images:bundle.BundleImages.map(image=>image.Value)                
                })
            });

            let selectedCourier = courier.getValue.find(c => c.getId().equals(selectedCourierId) );


            let responsedata: OrderPayResponseDto = {
                id: response.getValue.getId().orderId,
                orderState: response.getValue.OrderState.orderState,
                orderCreatedDate: response.getValue.OrderCreatedDate.OrderCreatedDate,
                orderTimeCreated: response.getValue.OrderCreatedDate.OrderCreatedDate.toTimeString().split(' ')[0],
                totalAmount: response.getValue.TotalAmount.OrderAmount,
                currency: response.getValue.TotalAmount.OrderCurrency,
                orderDirection: {
                    lat: response.getValue.OrderDirection.Latitude,
                    long: response.getValue.OrderDirection.Longitude
                },
                products: productsresponse,
                bundles: bundlesresponse,
                orderPayment: {
                    amount: response.getValue.OrderPayment.PaymentAmount.Value,
                    currency: response.getValue.OrderPayment.PaymentCurrency.Value,
                    paymentMethod: response.getValue.OrderPayment.PaymentMethods.Value
                },
                orderCourier: {
                    courierName: selectedCourier.CourierName.courierName,
                    courierImage: selectedCourier.CourierImage.Value
                },
                orderUserId: data.userId
            }


            return Result.success(responsedata);
    }
}