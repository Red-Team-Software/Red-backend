import { Entity } from "src/common/domain/entity/entity";
import { OrderCourierId } from "./value-object/order-courier-id";
import { OrderCourierDirection } from "./value-object/order-courier-direction";


export class OrderCourier extends Entity<OrderCourierId> {

    constructor(
        private orderCourierId: OrderCourierId,
        private courierDirection: OrderCourierDirection,
    ){
        super(orderCourierId);
    }

    static create(
        orderCourierId: OrderCourierId,
        courierDirection: OrderCourierDirection
    ): OrderCourier {
        return new OrderCourier(
            orderCourierId,
            courierDirection
        );
    }

    get CourierDirection(): OrderCourierDirection {
        return this.courierDirection;
    }

}