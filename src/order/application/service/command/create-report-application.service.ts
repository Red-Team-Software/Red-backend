import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { OrderReport } from "src/order/domain/entities/report/report-entity";
import { OrderReportDescription } from "src/order/domain/entities/report/value-object/order-report-description";
import { OrderReportId } from "src/order/domain/entities/report/value-object/order-report-id";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { ErrorCreatingOrderReportApplicationException } from "../../application-exception/error-creating-order-report-application.exception";
import { ErrorSavingOrderReportApplicationException } from "../../application-exception/error-saving-order-report-application.exception";
import { NotFoundOrderApplicationException } from "../../application-exception/not-found-order-application.exception";
import { CreateOrderReportApplicationServiceRequestDto } from "../../dto/request/create-order-report-request-dto";
import { CreateOrderReportApplicationServiceResponseDto } from "../../dto/response/create-order-report-response.dto";
import { IQueryOrderRepository } from "../../query-repository/order-query-repository-interface";



export class CreateReportApplicationService extends IApplicationService<CreateOrderReportApplicationServiceRequestDto,CreateOrderReportApplicationServiceResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly idGen: IIdGen<string>,
    ){
        super();
    }

    async execute(data: CreateOrderReportApplicationServiceRequestDto): Promise<Result<CreateOrderReportApplicationServiceResponseDto>> {
        
        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let newOrder = response.getValue;

        if (newOrder.OrderState.orderState !== 'cancelled') return Result.fail(
            new ErrorCreatingOrderReportApplicationException()
        );

        let orderReport: OrderReport = OrderReport.create(
            OrderReportId.create( await this.idGen.genId() ),
            OrderReportDescription.create( data.description)
        );

        newOrder.addOrderReport(orderReport);

        let responseCommand = await this.orderRepository.saveOrder(newOrder);

        if (!responseCommand.isSuccess()) return Result.fail(new ErrorSavingOrderReportApplicationException());

        await this.eventPublisher.publish(newOrder.pullDomainEvents())

        let responseDto: CreateOrderReportApplicationServiceResponseDto = {
            orderId: newOrder.getId().orderId,
            description: data.description
        };

        return Result.success(responseDto);
    }

}