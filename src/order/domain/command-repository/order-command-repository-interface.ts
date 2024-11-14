import { Result } from "src/common/utils/result-handler/result";
import { Order } from "../aggregate/order";


export interface ICommandOrderRepository {
    saveOrder(order: Order): Promise<Result<Order>>
}