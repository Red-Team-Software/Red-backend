import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { ICalculateShippingFee } from 'src/order/domain/domain-services/interfaces/calculate-shippping-fee.interface';
import { ICalculateTaxesFee } from 'src/order/domain/domain-services/interfaces/calculate-taxes-fee.interface';
import { OrderTotalAmount } from 'src/order/domain/value_objects/order-totalAmount';
import { IPaymentMethodService } from 'src/order/domain/domain-services/interfaces/payment-method-interface';
import { OrderDirection } from 'src/order/domain/value_objects/order-direction';
import { ICommandOrderRepository } from 'src/order/domain/command-repository/order-command-repository-interface';
import { Order } from 'src/order/domain/aggregate/order';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { OrderCreatedDate } from 'src/order/domain/value_objects/order-created-date';
import { OrderId } from 'src/order/domain/value_objects/order-id';
import { OrderState } from 'src/order/domain/value_objects/order-state';
import { IGeocodification } from 'src/order/domain/domain-services/interfaces/geocodification-interface';
import { OrderAddressStreet } from 'src/order/domain/value_objects/order-direction-street';
import { Product } from 'src/product/domain/aggregate/product.aggregate';
import { Bundle } from 'src/bundle/domain/aggregate/bundle.aggregate';
import { OrderReport } from 'src/order/domain/entities/report/report-entity';
import { OrderPayment } from 'src/order/domain/entities/payment/order-payment-entity';
import { ICourierQueryRepository } from 'src/courier/application/query-repository/courier-query-repository-interface';
import { OrderCourierId } from 'src/order/domain/value_objects/order-courier-id';
import { OrderUserId } from 'src/order/domain/value_objects/order-user-id';
import { IDateHandler } from 'src/common/application/date-handler/date-handler.interface';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { IQueryPromotionRepository } from 'src/promotion/application/query-repository/promotion.query.repository.interface';
import { Promotion } from 'src/promotion/domain/aggregate/promotion.aggregate';
import { FindAllPromotionApplicationRequestDTO } from 'src/promotion/application/dto/request/find-all-promotion-application-request-dto';
import { IPaymentMethodQueryRepository } from 'src/payment-methods/application/query-repository/orm-query-repository.interface';
import { PaymentMethodId } from 'src/payment-methods/domain/value-objects/payment-method-id';
import { BundleDetail } from 'src/order/domain/entities/bundle-detail/bundle-detail-entity';
import { ProductDetail } from 'src/order/domain/entities/product-detail/product-detail-entity';
import { BundleDetailId } from 'src/order/domain/entities/bundle-detail/value_object/bundle-detail-id';
import { BundleDetailQuantity } from 'src/order/domain/entities/bundle-detail/value_object/bundle-detail-quantity';
import { ProductDetailId } from 'src/order/domain/entities/product-detail/value_object/product-detail-id';
import { ProductDetailQuantity } from 'src/order/domain/entities/product-detail/value_object/product-detail-quantity';
import { ProductDetailPrice } from 'src/order/domain/entities/product-detail/value_object/product-detail-price';
import { BundleDetailPrice } from 'src/order/domain/entities/bundle-detail/value_object/bundle-detail-price';
import { CalculateAmountService } from 'src/order/domain/domain-services/services/calculate-amount.service';
import { Cupon } from 'src/cupon/domain/aggregate/cupon.aggregate';
import { OrderCuponId } from 'src/order/domain/value_objects/order-cupon-id';
import { IQueryCuponRepository } from 'src/cupon/domain/query-repository/query-cupon-repository';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';
import { OrderPayApplicationServiceRequestDto } from '../../dto/request/order-pay-request-dto';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { ErrorCreatingOrderApplicationException } from '../../application-exception/error-creating-order-application.exception';
import { ErrorCreatingOrderBundleNotFoundApplicationException } from '../../application-exception/error-creating-order-bundle-not-found-application.exception';
import { ErrorCreatingOrderProductNotFoundApplicationException } from '../../application-exception/error-creating-order-product-not-found-application.exception';
import { ErrorCreatingPaymentApplicationException } from '../../application-exception/error-creating-payment-application.exception';
import { ErrorObtainingShippingFeeApplicationException } from '../../application-exception/error-obtaining-shipping-fee.application.exception';
import { ErrorObtainingTaxesApplicationException } from '../../application-exception/error-obtaining-taxes.application.exception';
import { OrderPayResponseDto } from '../../dto/response/order-pay-response-dto';


export class PayOrderAplicationService extends IApplicationService<OrderPayApplicationServiceRequestDto,OrderPayResponseDto>{
    
    private readonly calculateAmount = new CalculateAmountService();

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
        private readonly dateHandler: IDateHandler,
        private readonly queryPromotionRepositoy: IQueryPromotionRepository,
        private readonly paymentQueryRepository:IPaymentMethodQueryRepository,
        private readonly ormCuponQueryRepo: IQueryCuponRepository
    ){
        super()
    }
    
    async execute(data: OrderPayApplicationServiceRequestDto): Promise<Result<OrderPayResponseDto>> {

        let products:Product[]=[];
        let bundles:Bundle[]=[];
        let orderproducts: ProductDetail[] = [];
        let orderBundles: BundleDetail[] = [];
        let promotions: Promotion[] = [];
        let cupon: Cupon;

        let paymentResponse=await this.paymentQueryRepository.findMethodById(
            PaymentMethodId.create(data.paymentId)
        )

        if (!paymentResponse.isSuccess())
            return Result.fail(paymentResponse.getError)

        if (data.cuponId){
            let cuponRes = await this.ormCuponQueryRepo.findCuponById(CuponId.create(data.cuponId))

            if (!cuponRes.isSuccess())
                return Result.fail(cuponRes.getError)
            cupon = cuponRes.getValue;
        }


        let findPromotion: FindAllPromotionApplicationRequestDTO = {
            userId: data.userId,
            name: '',
            perPage: 1000,
            page: 0
        }

        let promoResponse = await this.queryPromotionRepositoy.findAllPromotion(findPromotion);

        if (promoResponse.isSuccess()) promotions = promoResponse.getValue;


        if(data.products){
            
            for (const product of data.products){
                let domain=await this.productRepository.findProductById(ProductID.create(product.id))

                if(!domain.isSuccess())
                    return Result.fail(new ErrorCreatingOrderProductNotFoundApplicationException())

                products.push(domain.getValue)
            }
            // TODO hacerlo servicio de dominio
            products.forEach(product => {
                let promotion = promotions.find(promo => {
                    return promo.Products.some(productId => productId.Value === product.getId().Value);
                });
        
                let productTotal = product.ProductPrice.Price;
        
                if (promotion) productTotal -= (product.ProductPrice.Price * (promotion.PromotionDiscounts.Value));
        
                let pr = ProductDetail.create(
                    ProductDetailId.create(product.getId().Value),
                    ProductDetailQuantity.create(data.products.find(p=>p.id==product.getId().Value).quantity),
                    ProductDetailPrice.create(productTotal, product.ProductPrice.Currency)
                );

                orderproducts.push( pr );

            });
            
        }

        // TODO hacerlo servicio de dominio

        if(data.bundles){
            for (const bundle of data.bundles){
                let domain=await this.bundleRepository.findBundleById(BundleId.create(bundle.id))

                if(!domain.isSuccess())
                    return Result.fail(new ErrorCreatingOrderBundleNotFoundApplicationException())
                bundles.push(domain.getValue)
            }

            bundles.forEach(bundle => {
                let promotion = promotions.find(promo => {
                    return promo.Bundles.some(bundleId => bundleId.Value === bundle.getId().Value);
                });
        
                let bundleTotal = bundle.BundlePrice.Price;
        
                if (promotion) 
                    bundleTotal -= (bundle.BundlePrice.Price * (promotion.PromotionDiscounts.Value ));
        
                let bu = BundleDetail.create(
                    BundleDetailId.create(bundle.getId().Value),
                    BundleDetailQuantity.create(data.bundles.find(b=>b.id==bundle.getId().Value).quantity),
                    BundleDetailPrice.create(bundleTotal, bundle.BundlePrice.Currency)
                );

                orderBundles.push( bu );
            });
        }

        let amount = this.calculateAmount.calculateAmount(
            products,
            bundles,
            orderproducts,
            orderBundles,
            cupon,
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

            let orderUserId: OrderUserId = OrderUserId.create(data.userId);

            let orderCupon: OrderCuponId;

            if(data.cuponId && cupon) 
                orderCupon = OrderCuponId.create(cupon.getId().Value);

            let order = Order.initializeAggregate(
                OrderId.create(await this.idGen.genId()),
                OrderState.create('waiting'),
                OrderCreatedDate.create(this.dateHandler.currentDate()),
                total,
                orderDirection,
                orderUserId,
                orderCupon
                ? orderCupon
                : null,
                null,
                orderproducts,
                orderBundles,
                null, 
                null, 
                orderPayment
            );

            let response = await this.payOrder.createPayment(order);

            if (!response.isSuccess()) 
                return Result.fail(new ErrorCreatingPaymentApplicationException());

            
            let responseDB = await this.orderRepository.saveOrder(response.getValue); 

            if (!responseDB.isSuccess()) 
                return Result.fail(new ErrorCreatingOrderApplicationException());

            await this.eventPublisher.publish(response.getValue.pullDomainEvents());

            let productsresponse:{
                id: string,
                quantity: number
                name:string 
                description:string
                price:number 
                images:string[]
                currency:string
            }[]=[];

            let bundlesresponse:{
                id: string,
                quantity: number
                name:string 
                description:string
                price:number 
                currency:string
                images:string[]
            }[]=[];

            if(data.products)
            products.forEach(product=>{
                productsresponse.push({
                    id: product.getId().Value,
                    quantity: order.Products.find(
                        orderproduct=>product.getId().equals(ProductID.create(orderproduct.ProductDetailId.productDetailId))
                    ).Quantity.Quantity,
                    name:product.ProductName.Value,
                    description:product.ProductDescription.Value,
                    price:product.ProductPrice.Price,
                    currency:product.ProductPrice.Currency,
                    images:product.ProductImages.map(image=>image.Value)
                })
            });

            if(data.bundles)
            bundles.forEach(bundle=>{
                bundlesresponse.push({
                    id: bundle.getId().Value,
                    quantity: order.Bundles.find(
                        orderBundle=>bundle.getId().equals(BundleId.create(orderBundle.BundleDetailId.BundleDetailId))
                    ).Quantity.Quantity,
                    name:bundle.BundleName.Value ,
                    description:bundle.BundleDescription.Value,
                    price:bundle.BundlePrice.Price,
                    currency:bundle.BundlePrice.Currency,
                    images:bundle.BundleImages.map(image=>image.Value)                
                })
            });


            let responsedata: OrderPayResponseDto = {
                id: response.getValue.getId().orderId,
                orderState: response.getValue.OrderState.orderState,
                orderCreatedDate: response.getValue.OrderCreatedDate.OrderCreatedDate,
                orderTimeCreated: response.getValue.OrderCreatedDate.OrderCreatedDate.toTimeString().split(' ')[0],
                totalAmount: parseFloat(response.getValue.TotalAmount.OrderAmount.toFixed(2)),
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
                orderUserId: data.userId
            }

            return Result.success(responsedata);
    }
}