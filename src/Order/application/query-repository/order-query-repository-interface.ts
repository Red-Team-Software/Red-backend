import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/Order/domain/aggregate/order";
import { FindAllOrdersApplicationServiceRequestDto } from "../dto/request/find-all-orders-request.dto";



export interface IQueryOrderRepository {
    findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>>;
}