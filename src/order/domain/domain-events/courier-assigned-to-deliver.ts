import { DomainEvent } from "src/common/domain";
import { OrderId } from "../value_objects/order-id";
import { OrderState } from "../value_objects/order-state";
import { OrderUserId } from "../value_objects/order-user-id";
import { OrderCourierId } from "../value_objects/order-courier-id";

export class CourierAssignedToDeliver extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderState: this.orderState.orderState,
            orderUserId: this.orderUserId.userId,
            orderCourierId: this.orderCourierId
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public orderId: OrderId,
        public orderState: OrderState,
        public orderUserId:OrderUserId,
        public orderCourierId: OrderCourierId
    ){
        super();
    }

    static create (
        id: OrderId,
        orderState: OrderState,
        orderUserId:OrderUserId,
        orderCourierId: OrderCourierId
    ){
        let order = new CourierAssignedToDeliver(
            id,
            orderState,
            orderUserId,
            orderCourierId
        );
        return order;
    }
}