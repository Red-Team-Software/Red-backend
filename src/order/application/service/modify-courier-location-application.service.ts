import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryOrderRepository } from "../query-repository/order-query-repository-interface";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { NotFoundOrderApplicationException } from "../application-exception/not-found-order-application.exception";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ModifyCourierLocationResponseDto } from "../dto/response/modify-courier-location-response.dto";
import { OrderCourierDirection } from "src/order/domain/entities/order-courier/value-object/order-courier-direction";
import { OrderCourier } from "src/order/domain/entities/order-courier/order-courier-entity";
import { ErrorModifingOrderDeliveryApplicationException } from "../application-exception/error-modifing-order-delivery-location.application.exception";
import { ModifyCourierLocationRequestDto } from "../dto/request/modify-courier-location-request.dto";
import { IGeocodification } from "src/order/domain/domain-services/interfaces/geocodification-interface";



export class ModifyCourierLocationApplicationService extends IApplicationService<ModifyCourierLocationRequestDto,ModifyCourierLocationResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly geocodificationAddress: IGeocodification,
    ){
        super()
    }

    async execute(data: ModifyCourierLocationRequestDto): Promise<Result<ModifyCourierLocationResponseDto>> {
        
        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let newOrder = response.getValue;

        let location = OrderCourierDirection.create(data.lat, data.long);

        let orderCourier = OrderCourier.create(
            newOrder.OrderCourier.getId(), 
            location
        );

        newOrder.modifyCourierLocation(orderCourier);

        let responsoRepo = await this.orderRepository.saveOrder(newOrder);

        if (responsoRepo.isFailure()) return Result.fail(new ErrorModifingOrderDeliveryApplicationException());

        this.eventPublisher.publish(newOrder.pullDomainEvents());

        let responseDto: ModifyCourierLocationResponseDto = {
            orderId: newOrder.getId().orderId,
            lat: data.lat,
            long: data.long
        };

        return Result.success(responseDto);
    }

}