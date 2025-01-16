import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundOrderApplicationException } from "../../application-exception/not-found-order-application.exception";
import { FindAllOrdersByUserApplicationServiceRequestDto } from "../../dto/request/find-all-orders-by-user-request.dto";
import { FindAllOrdersApplicationServiceResponseDto } from "../../dto/response/find-all-orders-response.dto";
import { IQueryOrderRepository } from "../../query-repository/order-query-repository-interface";




export class FindAllOdersByUserApplicationService extends IApplicationService<FindAllOrdersByUserApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository,
    ){
        super()
    }
    
    async execute(data: FindAllOrdersByUserApplicationServiceRequestDto): Promise<Result<FindAllOrdersApplicationServiceResponseDto>> {

        data.page = data.page * data.perPage - data.perPage

        let response = await this.orderRepository.findAllOrdersByUserDetails(data);

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let orders = response.getValue;
        
        const ord = await Promise.all(
            orders.map(async order => {
            const summaryOrder = [
                ...order.products.map(product => `${product.name} (${product.quantity})`),
                ...order.bundles.map(bundle => `${bundle.name} (${bundle.quantity})`),
            ].join(', ');

            return {
                id: order.orderId,
                last_state: {
                    state: order.orderState,
                    date: new Date(),
                },
                totalAmount: order.totalAmount,
                summary_order: summaryOrder,
                };
            }),
        );

        

        return Result.success(new FindAllOrdersApplicationServiceResponseDto(ord));

    }
}