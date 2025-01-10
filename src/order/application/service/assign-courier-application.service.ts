import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryOrderRepository } from "../query-repository/order-query-repository-interface";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { NotFoundOrderApplicationException } from "../application-exception/not-found-order-application.exception";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ErrorModifiyingOrderStateApplicationException } from "../application-exception/error-modifying-order-status-application.exception";
import { ErrorOrderAlreadyCancelledApplicationException } from "../application-exception/error-orden-already-cancelled-application.exception";
import { AssignCourierApplicationServiceRequestDto } from "../dto/request/assign-courier-request-dto";
import { AssignCourierApplicationServiceResponseDto } from "../dto/response/assign-courier-response-dto";
import { ICourierQueryRepository } from "src/courier/application/query-repository/courier-query-repository-interface";
import { ErrorOrderAlreadyHaveCourierAssignedApplicationException } from "../application-exception/error-orden-already-have-courier-assigned-application.exception";
import { OrderCourierId } from 'src/order/domain/value_objects/order-courier-id';
import { CourierId } from '../../../courier/domain/value-objects/courier-id';
import { NotFoundCourierApplicationException } from "src/courier/application/application-exceptions/not-found-courier-application.exception";



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

        if (!newOrder.OrderCourierId) return Result.fail(
            new ErrorOrderAlreadyHaveCourierAssignedApplicationException()
        );
        
        if (newOrder.OrderState.orderState === 'cancelled') return Result.fail(
            new ErrorOrderAlreadyCancelledApplicationException(' Cant assign courier to a cancelled order')
        );

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
