import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { ErrorModifiyingOrderStateApplicationException } from "../../application-exception/error-modifying-order-status-application.exception";
import { NotFoundOrderApplicationException } from "../../application-exception/not-found-order-application.exception";
import { CancelOrderApplicationServiceRequestDto } from "../../dto/request/cancel-order-request-dto";
import { CancelOrderApplicationServiceResponseDto } from "../../dto/response/cancel-order-response-dto";
import { IQueryOrderRepository } from "../../query-repository/order-query-repository-interface";



export class CancelOderApplicationService extends IApplicationService<CancelOrderApplicationServiceRequestDto,CancelOrderApplicationServiceResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly eventPublisher: IEventPublisher
    ){
        super()
    }

    async execute(data: CancelOrderApplicationServiceRequestDto): Promise<Result<CancelOrderApplicationServiceResponseDto>> {

        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let newOrder = response.getValue;

        newOrder.cancelOrder();

        let responseCommand = await this.orderRepository.saveOrder(newOrder);

        if (!responseCommand.isSuccess()) 
            return Result.fail(new ErrorModifiyingOrderStateApplicationException());

        await this.eventPublisher.publish(newOrder.pullDomainEvents())

        let responseDto: CancelOrderApplicationServiceResponseDto = {
            orderId: newOrder.getId().orderId,
            state: newOrder.OrderState.orderState
        };

        return Result.success(responseDto);
    }

}
