import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCourierApplicationException } from "src/courier/application/application-exceptions/not-found-courier-application.exception";
import { ICourierQueryRepository } from "src/courier/application/repository/query-repository/courier-query-repository-interface";
import { CourierId } from "src/courier/domain/value-objects/courier-id";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { OrderCourierId } from "src/order/domain/value_objects/order-courier-id";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { ErrorModifiyingOrderStateApplicationException } from "../../application-exception/error-modifying-order-status-application.exception";
import { ErrorOrderAlreadyHaveCourierAssignedApplicationException } from "../../application-exception/error-orden-already-have-courier-assigned-application.exception";
import { NotFoundOrderApplicationException } from "../../application-exception/not-found-order-application.exception";
import { AssignCourierApplicationServiceRequestDto } from "../../dto/request/assign-courier-request-dto";
import { AssignCourierApplicationServiceResponseDto } from "../../dto/response/assign-courier-response-dto";
import { IQueryOrderRepository } from "../../query-repository/order-query-repository-interface";




export class AssignCourierApplicationService extends IApplicationService<AssignCourierApplicationServiceRequestDto,AssignCourierApplicationServiceResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly ormCourierQueryRepository: ICourierQueryRepository
    ){
        super()
    }

    async execute(data: AssignCourierApplicationServiceRequestDto): Promise<Result<AssignCourierApplicationServiceResponseDto>> {
        
        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let newOrder = response.getValue;

        let courierRes = await this.ormCourierQueryRepository.findCourierById(CourierId.create(data.courierId));

        if (!courierRes.isSuccess()) 
            return Result.fail(new NotFoundCourierApplicationException());

        if (newOrder.OrderCourierId) 
        return Result.fail(new ErrorOrderAlreadyHaveCourierAssignedApplicationException());

        newOrder.assignCourierToDeliver(
            OrderCourierId.create(data.courierId),
            OrderState.create('delivering')
        );

        let responseCommand = await this.orderRepository.saveOrder(newOrder);

        if (!responseCommand.isSuccess()) return Result.fail(new ErrorModifiyingOrderStateApplicationException());

        await this.eventPublisher.publish(newOrder.pullDomainEvents())

        let responseDto: AssignCourierApplicationServiceResponseDto = {
            orderId: newOrder.getId().orderId,
            state: newOrder.OrderState.orderState,
            courierId: newOrder.OrderCourierId.OrderCourierId
        };

        return Result.success(responseDto);
    }

}
