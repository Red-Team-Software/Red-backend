import { DomainEvent } from "src/common/domain";
import { OrderId } from "../value_objects/order-id";
import { OrderCourier } from "../entities/order-courier/order-courier-entity";

export class OrderCourierLocationModified extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderCourier: this.orderCourier
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public orderId: OrderId,
        public orderCourier: OrderCourier,
    ){
        super();
    }

    static create (
        id: OrderId,
        orderCourier: OrderCourier,
    ){
        let order = new OrderCourierLocationModified(
            id,
            orderCourier
        );
        return order;
    }
}