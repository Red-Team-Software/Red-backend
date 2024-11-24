import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { FindAllOrdersApplicationServiceRequestDto } from "../dto/request/find-all-orders-request.dto";
import { OrderId } from "src/order/domain/value_objects/orderId";



export interface IQueryOrderRepository {
    findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>>;
    findOrderById(orderId: OrderId): Promise<Result<Order>>;
    findOrderPaymentId(orderId: OrderId): Promise<Result<string>>;
}