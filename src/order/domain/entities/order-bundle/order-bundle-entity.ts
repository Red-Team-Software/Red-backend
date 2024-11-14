import { Entity } from "src/common/domain";
import { OrderBundleQuantity } from "./value_object/order-bundle-quantity";
import { OrderBundleId } from "./value_object/order-bundlesId";


export class OrderBundle extends Entity<OrderBundleId> {
    
    constructor(
        private orderBundleId: OrderBundleId,
        private quantity: OrderBundleQuantity
    ) {
        super(orderBundleId);
    }

    static create(
        orderProductId: OrderBundleId,
        quantity: OrderBundleQuantity
    ): OrderBundle {
        return new OrderBundle(
            orderProductId,
            quantity
        );
    }

    get OrderBundleId(): OrderBundleId {
        return this.orderBundleId;
    }

    get Quantity(): OrderBundleQuantity {
        return this.quantity;
    }
}