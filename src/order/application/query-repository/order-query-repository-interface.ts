import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { FindAllOrdersApplicationServiceRequestDto } from "../dto/request/find-all-orders-request.dto";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { IOrderModel } from "../model/order.model.interface";
import { OrderUserId } from "src/order/domain/value_objects/order-user-id";



export interface IQueryOrderRepository {
    findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>>;
    findAllOrdersByUser(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>>;
    findOrderById(orderId: OrderId): Promise<Result<Order>>;
    findAllOrdersDetails(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<IOrderModel[]>>;
    findAllOrdersByUserDetails(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<IOrderModel[]>>;
    findOrderByIdDetails(orderId: OrderId): Promise<Result<IOrderModel>>;
}