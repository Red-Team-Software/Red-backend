import { Entity } from "src/common/domain";
import { OrderProductId } from "./value_object/order-productId";
import { OrderProductQuantity } from "./value_object/order-product-quantity";

export class OrderProduct extends Entity<OrderProductId> {
    
    constructor(
        private orderProductId: OrderProductId,
        private quantity: OrderProductQuantity
    ) {
        super(orderProductId);
    }

    static create(
        orderProductId: OrderProductId,
        quantity: OrderProductQuantity
    ): OrderProduct {
        return new OrderProduct(
            orderProductId,
            quantity
        );
    }

    get OrderProductId(): OrderProductId {
        return this.orderProductId;
    }

    get Quantity(): OrderProductQuantity {
        return this.quantity;
    }

}