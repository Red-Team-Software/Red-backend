import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { IQueryOrderRepository } from '../query-repository/order-query-repository-interface';
import { NotFoundOrderApplicationException } from '../application-exception/not-found-order-application.exception';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { ErrorCreatingOrderProductNotFoundApplicationException } from '../application-exception/error-creating-order-product-not-found-application.exception';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { ErrorCreatingOrderBundleNotFoundApplicationException } from '../application-exception/error-creating-order-bundle-not-found-application.exception';
import { bundlesOrderType, productsOrderType } from '../types/get-all-orders-types';
import { ICourierQueryRepository } from 'src/courier/application/query-repository/courier-query-repository-interface';
import { FindOrderByIdRequestDto } from '../dto/request/find-order-by-id-request-dto';
import { bundlesOrderByIdResponse, courierOrderByIdResponse, FindOrderByIdResponseDto, orderByIdResponse, productsOrderByIdResponse } from '../dto/response/find-order-by-id-response-dto';
import { OrderId } from 'src/order/domain/value_objects/order-id';
import { CourierId } from 'src/courier/domain/value-objects/courier-id';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';


export class FindOrderByIdApplicationService extends IApplicationService<FindOrderByIdRequestDto,FindOrderByIdResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository,
        private readonly productRepository:IQueryProductRepository,
        private readonly bundleRepository:IQueryBundleRepository,
        private readonly ormCourierQueryRepository: ICourierQueryRepository
    ){
        super()
    }
    
    async execute(data: FindOrderByIdRequestDto): Promise<Result<FindOrderByIdResponseDto>> {

        let response = await this.orderRepository.findOrderById(OrderId.create(data.orderId));

        if (response.isFailure()) return Result.fail(new NotFoundOrderApplicationException());

        let order = response.getValue;

        let products: productsOrderType[] = [];  
        let bundles: bundlesOrderType[] = []; 


        if (order.Products && order.Products.length > 0) products.push({
            products: order.Products, 
            orderid: order.getId().orderId
        });

        if (order.Bundles && order.Bundles.length > 0) bundles.push({
            bundles: order.Bundles, 
            orderid: order.getId().orderId
        });


        let domainProducts: productsOrderByIdResponse[]=[];
        let domainBundles: bundlesOrderByIdResponse[]=[];

        if(products){
            for (const product of products){
                for (const prod of product.products){
                    let domain=await this.productRepository.findProductById(ProductID.create(prod.ProductDetailId.productDetailId))

                    if(!domain.isSuccess())
                        return Result.fail(new ErrorCreatingOrderProductNotFoundApplicationException())

                    domainProducts.push({
                        id: domain.getValue.getId().Value,
                        name: domain.getValue.ProductName.Value,
                        descripcion: domain.getValue.ProductDescription.Value,
                        quantity: prod.Quantity.Quantity,
                        price: prod.Price.Price,
                        images: domain.getValue.ProductImages.map((image)=>image.Value),
                        currency: domain.getValue.ProductPrice.Currency,
                        orderid: product.orderid
                    });
                }
            };
        };

        if(bundles){
            for (const bundle of bundles){
                for (const bund of bundle.bundles){
                    let domain=await this.bundleRepository.findBundleById(BundleId.create(bund.BundleDetailId.BundleDetailId))

                    if(!domain.isSuccess()) return Result.fail(new ErrorCreatingOrderBundleNotFoundApplicationException())
                

                    domainBundles.push({
                        id: domain.getValue.getId().Value,
                        name: domain.getValue.BundleName.Value,
                        descripcion: domain.getValue.BundleDescription.Value,
                        quantity: bund.Quantity.Quantity,
                        price: bund.Price.Price,
                        images: domain.getValue.BundleImages.map((image)=>image.Value),
                        currency: domain.getValue.BundlePrice.Currency,
                        orderid: bundle.orderid
                    });
                }
            };
        };

        let courierResponse = await this.ormCourierQueryRepository.findCourierById(CourierId.create(order.OrderCourier.getId().OrderCourierId));

        let associatedProducts;
        let associatedBundles;
            
        if (domainProducts) associatedProducts = domainProducts.filter((product) => product.orderid === order.getId().orderId); 
            
        if (domainBundles) associatedBundles = domainBundles.filter((bundle) => bundle.orderid === order.getId().orderId); 


        let associatedCourier: courierOrderByIdResponse = {
            courierName: courierResponse.getValue.CourierName.courierName,
            courierImage: courierResponse.getValue.CourierImage.Value,
            location: {
                lat: order.OrderCourier.CourierDirection.Latitude,
                long: order.OrderCourier.CourierDirection.Longitude
            }
        };

        let ordersDto: orderByIdResponse = {
            orderId: order.getId().orderId,
            orderState: order.OrderState.orderState,
            orderCreatedDate: order.OrderCreatedDate.OrderCreatedDate,
            orderTimeCreated: new Date(order.OrderCreatedDate.OrderCreatedDate).toTimeString().split(' ')[0],
            totalAmount: order.TotalAmount.OrderAmount,
            orderReceivedDate: order.OrderReceivedDate? order.OrderReceivedDate.OrderReceivedDate : null,
            orderPayment: {
                paymetAmount: order.OrderPayment.PaymentAmount.Value,
                paymentCurrency: order.OrderPayment.PaymentCurrency.Value,
                payementMethod: order.OrderPayment.PaymentMethods.Value
            },
            orderDirection: {
                lat: order.OrderDirection.Latitude,
                long: order.OrderDirection.Longitude
            },
            products: associatedProducts,
            bundles: associatedBundles,
            orderReport: order.OrderReport ? {
                id: order.OrderReport.getId().OrderReportId,
                description: order.OrderReport.Description.Value,
                orderid: order.getId().orderId
            } : null,
            orderCourier: associatedCourier
        };

        return Result.success(new FindOrderByIdResponseDto(ordersDto));
    }
}