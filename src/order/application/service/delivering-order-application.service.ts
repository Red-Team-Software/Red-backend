import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryOrderRepository } from "../query-repository/order-query-repository-interface";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { NotFoundOrderApplicationException } from "../application-exception/not-found-order-application.exception";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ErrorModifiyingOrderStateApplicationException } from "../application-exception/error-modifying-order-status-application.exception";
import { DeliveringOrderApplicationServiceRequestDto } from "../dto/request/delivering-order-request-dto";
import { DeliveringOrderApplicationServiceResponseDto } from "../dto/response/delivering-order-response-dto";
import { ErrorOrderAlreadyDeliveringApplicationException } from "../application-exception/error-orden-already-delivering-application.exception";
import { ErrorOrderAlreadyCancelledApplicationException } from "../application-exception/error-orden-already-cancelled-application.exception";



export class DeliveringOderApplicationService extends IApplicationService<DeliveringOrderApplicationServiceRequestDto,DeliveringOrderApplicationServiceResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly eventPublisher: IEventPublisher,
    ){
        super()
    }

    async execute(data: DeliveringOrderApplicationServiceRequestDto): Promise<Result<DeliveringOrderApplicationServiceResponseDto>> {
        
        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let newOrder = response.getValue;

        if (newOrder.OrderState.orderState === 'delivering') return Result.fail(
            new ErrorOrderAlreadyDeliveringApplicationException()
        );
        
        if (newOrder.OrderState.orderState === 'cancelled') return Result.fail(
            new ErrorOrderAlreadyCancelledApplicationException('The order cant be delivered because is already cancelled')
        );

        newOrder.orderDelivering(OrderState.create('delivering'));

        let responseCommand = await this.orderRepository.saveOrder(newOrder);

        if (!responseCommand.isSuccess()) return Result.fail(new ErrorModifiyingOrderStateApplicationException());

        await this.eventPublisher.publish(newOrder.pullDomainEvents())

        let responseDto: DeliveringOrderApplicationServiceResponseDto = {
            orderId: newOrder.getId().orderId,
            state: newOrder.OrderState.orderState
        };

        return Result.success(responseDto);
    }

}
