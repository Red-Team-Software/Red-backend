import { DomainEvent } from "src/common/domain";
import { OrderId } from "../value_objects/order-id";
import { OrderState } from "../value_objects/order-state";
import { OrderUserId } from "../value_objects/order-user-id";

export class OrderStatusDelivering extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderState: this.orderState.orderState,
            orderUserId: this.orderUserId,
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public orderId: OrderId,
        public orderState: OrderState,
        public orderUserId:OrderUserId
    ){
        super();
    }

    static create (
        id: OrderId,
        orderState: OrderState,
        orderUserId:OrderUserId
    ){
        let order = new OrderStatusDelivering(
            id,
            orderState,
            orderUserId
        );
        return order;
    }
}