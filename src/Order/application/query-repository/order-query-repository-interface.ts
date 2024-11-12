import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/Order/domain/aggregate/order";



export interface IOrderQueryRepository {
    findAllOrders(): Promise<Result<Order[]>>;
}