import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";


export class OrderCommandRepositoryMock implements ICommandOrderRepository{
    
    private orders: Order[] = [];
    
    async saveOrder(order: Order): Promise<Result<Order>> {
        this.orders.push(order);
        return Result.success(order);
    }

}