import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { ICourierQueryRepository } from 'src/courier/application/query-repository/courier-query-repository-interface';
import { OrderId } from 'src/order/domain/value_objects/order-id';
import { CourierId } from 'src/courier/domain/value-objects/courier-id';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { IQueryOrderRepository } from '../../query-repository/order-query-repository-interface';
import { FindOrderByIdRequestDto } from '../../dto/request/find-order-by-id-request-dto';
import { bundlesOrderByIdResponse, courierOrderByIdResponse, FindOrderByIdResponseDto, orderByIdResponse, productsOrderByIdResponse } from '../../dto/response/find-order-by-id-response-dto';
import { NotFoundOrderApplicationException } from '../../application-exception/not-found-order-application.exception';
import { bundlesOrderType, productsOrderType } from '../../types/get-all-orders-types';
import { ErrorCreatingOrderProductNotFoundApplicationException } from '../../application-exception/error-creating-order-product-not-found-application.exception';
import { ErrorCreatingOrderBundleNotFoundApplicationException } from '../../application-exception/error-creating-order-bundle-not-found-application.exception';
import { Courier } from 'src/courier/domain/aggregate/courier';


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

        let response = await this.orderRepository.findOrderByIdDetails(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let order = response.getValue;

        let domainProducts: productsOrderByIdResponse[]=[];
        let domainBundles: bundlesOrderByIdResponse[]=[];

        // let products: productsOrderType[] = [];  
        // let bundles: bundlesOrderType[] = []; 


        // if (order.Products && order.Products.length > 0) products.push({
        //     products: order.Products, 
        //     orderid: order.getId().orderId
        // });

        // if (order.Bundles && order.Bundles.length > 0) bundles.push({
        //     bundles: order.Bundles, 
        //     orderid: order.getId().orderId
        // });

        // if(products){
        //     for (const product of products){
        //         for (const prod of product.products){
        //             let domain=await this.productRepository.findProductById(ProductID.create(prod.ProductDetailId.productDetailId))

        //             if(!domain.isSuccess())
        //                 return Result.fail(new ErrorCreatingOrderProductNotFoundApplicationException())

        //             domainProducts.push({
        //                 id: domain.getValue.getId().Value,
        //                 name: domain.getValue.ProductName.Value,
        //                 description: domain.getValue.ProductDescription.Value,
        //                 quantity: prod.Quantity.Quantity,
        //                 price: Number(prod.Price.Price),
        //                 images: domain.getValue.ProductImages.map((image)=>image.Value),
        //                 currency: domain.getValue.ProductPrice.Currency,
        //                 orderid: product.orderid
        //             });
        //         }
        //     };
        // };

        // if(bundles){
        //     for (const bundle of bundles){
        //         for (const bund of bundle.bundles){
        //             let domain=await this.bundleRepository.findBundleById(BundleId.create(bund.BundleDetailId.BundleDetailId))

        //             if(!domain.isSuccess()) return Result.fail(new ErrorCreatingOrderBundleNotFoundApplicationException())
                

        //             domainBundles.push({
        //                 id: domain.getValue.getId().Value,
        //                 name: domain.getValue.BundleName.Value,
        //                 description: domain.getValue.BundleDescription.Value,
        //                 quantity: bund.Quantity.Quantity,
        //                 price: Number(bund.Price.Price),
        //                 images: domain.getValue.BundleImages.map((image)=>image.Value),
        //                 currency: domain.getValue.BundlePrice.Currency,
        //                 orderid: bundle.orderid
        //             });
        //         }
        //     };
        // };
        
        // let associatedCourier: courierOrderByIdResponse

        // if (order.OrderCourierId){
        //     let courierResponse = await this.ormCourierQueryRepository.findCourierById(
        //         CourierId.create(order.OrderCourierId.OrderCourierId));

        //     let associatedCourier: courierOrderByIdResponse = {
        //         courierName: courierResponse.getValue.CourierName.courierName,
        //         courierImage: courierResponse.getValue.CourierImage.Value,
        //         location: {
        //             lat: courierResponse.getValue.CourierDirection.Latitude,
        //             long: courierResponse.getValue.CourierDirection.Longitude
        //         }
        //     };
        // }

        // let ordersDto: orderByIdResponse = {
        //     orderId: order.getId().orderId,
        //     orderState: order.OrderState.orderState,
        //     orderCreatedDate: order.OrderCreatedDate.OrderCreatedDate,
        //     orderTimeCreated: new Date(order.OrderCreatedDate.OrderCreatedDate).toTimeString().split(' ')[0],
        //     totalAmount: order.TotalAmount.OrderAmount,
        //     orderReceivedDate: order.OrderReceivedDate? order.OrderReceivedDate.OrderReceivedDate : null,
        //     orderPayment: {
        //         paymetAmount: order.OrderPayment.PaymentAmount.Value,
        //         paymentCurrency: order.OrderPayment.PaymentCurrency.Value,
        //         payementMethod: order.OrderPayment.PaymentMethods.Value
        //     },
        //     orderDirection: {
        //         lat: order.OrderDirection.Latitude,
        //         long: order.OrderDirection.Longitude
        //     },
        //     products: order.Products ? 
        //     domainProducts.filter((product) => product.orderid === order.getId().orderId)
        //     : []
        //     ,
        //     bundles: order.Bundles 
        //     ? domainBundles.filter((bundle) => bundle.orderid === order.getId().orderId)
        //     : []
        //     ,
        //     orderReport: order.OrderReport ? {
        //         id: order.OrderReport.getId().OrderReportId,
        //         description: order.OrderReport.Description.Value,
        //         orderid: order.getId().orderId
        //     } : null,
        //     orderCourier: order.OrderCourierId ? associatedCourier : null
        // };

        if(order.products){
            for (const product of order.products){
                domainProducts.push({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    quantity: product.quantity,
                    price: product.price,
                    images: product.images,
                    currency: product.currency
                });
            };
        };

        if(order.bundles){
            for (const bundle of order.bundles){
                domainBundles.push({
                    id: bundle.id,
                    name: bundle.name,
                    description: bundle.description,
                    quantity: bundle.quantity,
                    price: bundle.price,
                    images: bundle.images,
                    currency: bundle.currency
                });
            };
        };

        let associatedCourier: courierOrderByIdResponse

        if (order.orderCourier){
            associatedCourier = {
                courierName: order.orderCourier.courierName,
                courierImage: order.orderCourier.courierImage,
                phone: "584121234567"
            };
        }

        let state = [{
            state: order.orderState,
            date: order.orderCreatedDate
        }]

        let ordersDto: orderByIdResponse = {
            orderId: order.orderId,
            orderState: state,
            orderTimeCreated: new Date(order.orderCreatedDate).toTimeString().split(' ')[0],
            totalAmount: order.totalAmount,
            subTotal: order.totalAmount,
            orderReceivedDate: order.orderReceivedDate ? order.orderReceivedDate : null,
            orderPayment: {
                paymetAmount: order.orderPayment.paymetAmount,
                paymentCurrency: order.orderPayment.paymentCurrency,
                payementMethod: order.orderPayment.payementMethod
            },
            orderDirection: {
                lat: order.orderDirection.lat,
                long: order.orderDirection.long
            },
            products: order.products ? 
            domainProducts
            : []
            ,
            bundles: order.bundles 
            ? domainBundles
            : []
            ,
            orderReport: order.orderReport ? {
                description: order.orderReport.description
            } : null,
            orderCourier: order.orderCourier ? associatedCourier : null
        };

        return Result.success(new FindOrderByIdResponseDto(ordersDto));
    }
}