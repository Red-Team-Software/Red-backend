import { IApplicationService } from "src/common/application/services";
import { DeliveredOrderApplicationServiceRequestDto } from "../../dto/request/delivered-order-request-dto";
import { DeliveredOrderApplicationServiceResponseDto } from "../../dto/response/delivered-order-response-dto";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryOrderRepository } from "../../query-repository/order-query-repository-interface";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { NotFoundOrderApplicationException } from "../../application-exception/not-found-order-application.exception";
import { ErrorModifiyingOrderStateApplicationException } from "../../application-exception/error-modifying-order-status-application.exception";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { OrderReceivedDate } from "src/order/domain/value_objects/order-received-date";
import { IDateHandler } from "src/common/application/date-handler/date-handler.interface";




export class DeliveredOderApplicationService extends IApplicationService<DeliveredOrderApplicationServiceRequestDto,DeliveredOrderApplicationServiceResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly dateHandler: IDateHandler
    ){
        super()
    }

    async execute(data: DeliveredOrderApplicationServiceRequestDto): Promise<Result<DeliveredOrderApplicationServiceResponseDto>> {
        
        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let newOrder = response.getValue;

        newOrder.orderDelivered(OrderReceivedDate.create(this.dateHandler.currentDate())); 

        let responseCommand = await this.orderRepository.saveOrder(newOrder);

        if (!responseCommand.isSuccess()) return Result.fail(new ErrorModifiyingOrderStateApplicationException());

        await this.eventPublisher.publish(newOrder.pullDomainEvents())

        let responseDto: DeliveredOrderApplicationServiceResponseDto = {
            orderId: newOrder.getId().orderId,
            state: newOrder.OrderState.orderState
        };

        return Result.success(responseDto);
    }

}
