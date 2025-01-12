import { DomainEvent } from "src/common/domain";
import { OrderId } from "../value_objects/order-id";
import { OrderState } from "../value_objects/order-state";
import { OrderUserId } from "../value_objects/order-user-id";
import { OrderReceivedDate } from "../value_objects/order-received-date";

export class OrderStatusDelivered extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderState: this.orderState.orderState,
            orderUserId: this.orderUserId.userId,
            orderReceivedDate: this.orderReceivedDate.OrderReceivedDate
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public orderId: OrderId,
        public orderState: OrderState,
        public orderUserId:OrderUserId,
        public orderReceivedDate: OrderReceivedDate
    ){
        super();
    }

    static create (
        id: OrderId,
        orderState: OrderState,
        orderUserId:OrderUserId,
        orderReceivedDate: OrderReceivedDate
    ){
        let order = new OrderStatusDelivered(
            id,
            orderState,
            orderUserId,
            orderReceivedDate
        );
        return order;
    }
}