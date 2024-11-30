import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { IQueryOrderRepository } from '../query-repository/order-query-repository-interface';
import { NotFoundOrderApplicationException } from '../application-exception/not-found-order-application.exception';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { ErrorCreatingOrderProductNotFoundApplicationException } from '../application-exception/error-creating-order-product-not-found-application.exception';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { ErrorCreatingOrderBundleNotFoundApplicationException } from '../application-exception/error-creating-order-bundle-not-found-application.exception';
import { FindAllOrdersApplicationServiceRequestDto } from '../dto/request/find-all-orders-request.dto';
import { bundlesOrderResponse, courierOrderResponse, FindAllOrdersApplicationServiceResponseDto,  orderResponse, productsOrderResponse } from '../dto/response/find-all-orders-response.dto';
import { bundlesOrderType, productsOrderType } from '../types/get-all-orders-types';
import { ICourierQueryRepository } from 'src/courier/application/query-repository/courier-query-repository-interface';
import { IProductRepository } from 'src/product/domain/repository/product.repositry.interface';
import { IBundleRepository } from 'src/bundle/domain/repository/product.repositry.interface';


export class FindAllOdersApplicationService extends IApplicationService<FindAllOrdersApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository,
        private readonly productRepository:IProductRepository,
        private readonly bundleRepository:IBundleRepository,
        private readonly ormCourierQueryRepository: ICourierQueryRepository
    ){
        super()
    }
    
    async execute(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<FindAllOrdersApplicationServiceResponseDto>> {

        let response = await this.orderRepository.findAllOrders(data);

        if (!response.isSuccess) return Result.fail(new NotFoundOrderApplicationException());

        let orders = response.getValue;

        let products: productsOrderType[] = [];  
        let bundles: bundlesOrderType[] = []; 

        for (let order of orders){
            if (order.Products && order.Products.length > 0) products.push({
                products: order.Products, orderid: order.getId().orderId
            });
            if (order.Bundles && order.Bundles.length > 0) bundles.push({
                bundles: order.Bundles, 
                orderid: order.getId().orderId
            });
        };

        let domainProducts: productsOrderResponse[]=[];
        let domainBundles: bundlesOrderResponse[]=[];

        if(products){
            for (const product of products){
                for (const prod of product.products){
                    let domain=await this.productRepository.findProductById(ProductID.create(prod.OrderProductId.OrderProductId))

                    if(!domain.isSuccess())
                        return Result.fail(new ErrorCreatingOrderProductNotFoundApplicationException())

                    domainProducts.push({
                        id: domain.getValue.getId().Value,
                        name: domain.getValue.ProductName.Value,
                        descripcion: domain.getValue.ProductDescription.Value,
                        quantity: prod.Quantity.Quantity,
                        price: domain.getValue.ProductPrice.Price,
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
                    let domain=await this.bundleRepository.findBundleById(BundleId.create(bund.OrderBundleId.OrderBundleId))

                    if(!domain.isSuccess()) return Result.fail(new ErrorCreatingOrderBundleNotFoundApplicationException())
                

                    domainBundles.push({
                        id: domain.getValue.getId().Value,
                        name: domain.getValue.BundleName.Value,
                        descripcion: domain.getValue.BundleDescription.Value,
                        quantity: bund.Quantity.OrderBundleQuantity,
                        price: domain.getValue.BundlePrice.Price,
                        images: domain.getValue.BundleImages.map((image)=>image.Value),
                        currency: domain.getValue.BundlePrice.Currency,
                        orderid: bundle.orderid
                    });
                }
            };
        };

        let courierResponse = await this.ormCourierQueryRepository.findAllCouriers();

        let ordersDto: orderResponse[] = [];

        orders.forEach( (order) => {

            let associatedProducts;
            let associatedBundles;
            
            if (domainProducts) associatedProducts = domainProducts.filter((product) => product.orderid === order.getId().orderId); 
            
            if (domainBundles) associatedBundles = domainBundles.filter((bundle) => bundle.orderid === order.getId().orderId); 

            let courier = courierResponse.getValue.find(
                (courier) => courier.getId().courierId === order.OrderCourier.getId().OrderCourierId
            );

            let associatedCourier: courierOrderResponse = {
                courierName: courier.CourierName.courierName,
                courierImage: courier.CourierImage.Value
            };

            ordersDto.push({
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
                    lng: order.OrderDirection.Longitude
                },
                products: associatedProducts,
                bundles: associatedBundles,
                orderReport: order.OrderReport ? {
                    id: order.OrderReport.getId().OrderReportId,
                    description: order.OrderReport.Description.Value,
                    orderid: order.getId().orderId
                } : null,
                orderCourier: associatedCourier
            });
        });


        return Result.success(new FindAllOrdersApplicationServiceResponseDto(ordersDto));
    }
}