import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { ICourierQueryRepository } from 'src/courier/application/repository/query-repository/courier-query-repository-interface';
import { OrderId } from 'src/order/domain/value_objects/order-id';
import { IQueryOrderRepository } from '../../query-repository/order-query-repository-interface';
import { bundlesOrderByIdResponse, courierOrderByIdResponse, FindOrderByIdResponseDto, orderByIdResponse, productsOrderByIdResponse } from '../../dto/response/find-order-by-id-response-dto';
import { NotFoundOrderApplicationException } from '../../application-exception/not-found-order-application.exception';
import { FindOrderCourierPositionRequestDto } from '../../dto/request/find-order-courier-position-request-dto';
import { FindOrderCourierPositionApplicationServiceResponseDto } from '../../dto/response/find-order-courier-position-response-dto';
import { ErrorOrderDontHaveCourierAssignedApplicationException } from '../../application-exception/error-order-dont-have-courier-asigned-application-exception';



export class FindOrderCourierPositionApplicationService extends IApplicationService<FindOrderCourierPositionRequestDto,FindOrderCourierPositionApplicationServiceResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository
    ){
        super()
    }
    
    async execute(data: FindOrderCourierPositionRequestDto): Promise<Result<FindOrderCourierPositionApplicationServiceResponseDto>> {

        let response = await this.orderRepository.findOrderByIdDetails(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let order = response.getValue;

        if (!order.orderCourier)
            return Result.fail(new ErrorOrderDontHaveCourierAssignedApplicationException());

        let res = {
            latActual: order.orderCourier.location.lat.toString(),
            longActual: order.orderCourier.location.long.toString(),
            longPuntoLlegada: order.orderDirection.long.toString(),
            latPuntoLlegada: order.orderDirection.lat.toString()
        }

        return Result.success(res);
    }
}