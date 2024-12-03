import { DomainEvent } from "src/common/domain";
import { OrderId } from "../value_objects/order-id";
import { OrderState } from "../value_objects/order-state";



export class OrderStatusCanceled extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderState: this.orderState.orderState,
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public orderId: OrderId,
        public orderState: OrderState,
    ){
        super();
    }

    static create (
        id: OrderId,
        orderState: OrderState,
    ){
        let order = new OrderStatusCanceled(
            id,
            orderState
        );
        return order;
    }
}