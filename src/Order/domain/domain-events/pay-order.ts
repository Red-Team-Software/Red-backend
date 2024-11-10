import { DomainEvent } from "src/common/domain";
import { OrderId } from "../value_objects/orderId";
import { OrderPayment } from "../value_objects/order-payment";

export class PayOrder extends DomainEvent {
    
    orderId: OrderId;
    orderPayment: OrderPayment;

    constructor(
        orderId: OrderId,
        orderPayment: OrderPayment,
    ){
        super();
    }

    static create (
        id: OrderId,
        orderPayment?: OrderPayment
    ): PayOrder {
        return new PayOrder(
            id,
            orderPayment
        );
    }

    serialize(): string {
        return '';
    }

}