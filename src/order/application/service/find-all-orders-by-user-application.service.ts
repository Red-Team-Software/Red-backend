import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundOrderApplicationException } from "../application-exception/not-found-order-application.exception";
import { FindAllOrdersByUserApplicationServiceRequestDto } from "../dto/request/find-all-orders-by-user-request.dto";
import { FindAllOrdersApplicationServiceResponseDto } from "../dto/response/find-all-orders-response.dto";
import { IQueryOrderRepository } from "../query-repository/order-query-repository-interface";



export class FindAllOdersByUserApplicationService extends IApplicationService<FindAllOrdersByUserApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository)
    {
        super()
    }
    
    async execute(data: FindAllOrdersByUserApplicationServiceRequestDto): Promise<Result<FindAllOrdersApplicationServiceResponseDto>> {

        let response = await this.orderRepository.findAllOrdersByUser(data);

        if (response.isFailure()) 
            return Result.fail(new NotFoundOrderApplicationException());

        const order=response.getValue

        return Result.success({orders:order})
    }
}