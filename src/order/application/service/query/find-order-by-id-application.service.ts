import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { OrderId } from 'src/order/domain/value_objects/order-id';
import { IQueryOrderRepository } from '../../query-repository/order-query-repository-interface';
import { FindOrderByIdRequestDto } from '../../dto/request/find-order-by-id-request-dto';
import { bundlesOrderByIdResponse, courierOrderByIdResponse, FindOrderByIdResponseDto, orderByIdResponse, productsOrderByIdResponse } from '../../dto/response/find-order-by-id-response-dto';
import { NotFoundOrderApplicationException } from '../../application-exception/not-found-order-application.exception';


export class FindOrderByIdApplicationService extends IApplicationService<FindOrderByIdRequestDto,FindOrderByIdResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository,
    ){
        super()
    }
    
    async execute(data: FindOrderByIdRequestDto): Promise<Result<FindOrderByIdResponseDto>> {

        let response = await this.orderRepository.findOrderByIdDetails(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let order = response.getValue;

        let domainProducts: productsOrderByIdResponse[]=[];
        let domainBundles: bundlesOrderByIdResponse[]=[];


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
                lat: order.orderDirection.lat.toString(),
                long: order.orderDirection.long.toString()
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