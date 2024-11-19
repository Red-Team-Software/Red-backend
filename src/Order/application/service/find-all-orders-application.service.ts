import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { FindAllOrdersApplicationServiceRequestDto } from '../dto/request/find-all-orders-request.dto';
import { FindAllOrdersApplicationServiceResponseDto, order } from '../dto/response/find-all-orders-response.dto';
import { IQueryOrderRepository } from '../query-repository/order-query-repository-interface';
import { NotFoundOrderApplicationException } from '../application-exception/not-found-order-application.exception';


export class FindAllOdersApplicationService extends IApplicationService<FindAllOrdersApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository
    ){
        super()
    }
    
    async execute(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<FindAllOrdersApplicationServiceResponseDto>> {

        let response = await this.orderRepository.findAllOrders(data);

        if (!response.isSuccess) return Result.fail(new NotFoundOrderApplicationException());

        let orders = response.getValue;

        let ordersDto: order[] = [];

        orders.forEach( (order) => {
            ordersDto.push({
                orderId: order.getId().orderId,
                orderState: order.OrderState.orderState,
                orderCreatedDate: order.OrderCreatedDate.OrderCreatedDate,
                totalAmount: order.TotalAmount.OrderAmount,
                orderReciviedDate: order.OrderReceivedDate.OrderReceivedDate,
                orderPayment: {
                    paymetAmount: order.OrderPayment.Amount,
                    paymentCurrency: order.OrderPayment.Currency,
                    payementMethod: order.OrderPayment.PaymentMethod
                }
            })
        });

        return Result.success(new FindAllOrdersApplicationServiceResponseDto(ordersDto));
    }
}