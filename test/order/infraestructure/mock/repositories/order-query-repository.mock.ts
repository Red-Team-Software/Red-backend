import { Result } from "src/common/utils/result-handler/result";
import { FindAllOrdersApplicationServiceRequestDto } from "src/order/application/dto/request/find-all-orders-request.dto";
import { IQueryOrderRepository } from "src/order/application/query-repository/order-query-repository-interface";
import { Order } from "src/order/domain/aggregate/order";
import { OrderId } from "src/order/domain/value_objects/order-id";


export class OrderQueryRepositoryMock implements IQueryOrderRepository {
    
    constructor(private readonly orders: Order[] = []) {

    }
    
    async findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        let order = this.orders.slice(data.page, data.perPage);
        return Result.success(order);
    }
    
    async findAllOrdersByUser(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        let order = this.orders.slice(data.page, data.perPage);
        return Result.success(order);
    }
    
    async findOrderById(orderId: OrderId): Promise<Result<Order>> {
        let order = this.orders.find(order => order.getId().equals(orderId));
        return Result.success(order);
    }

}