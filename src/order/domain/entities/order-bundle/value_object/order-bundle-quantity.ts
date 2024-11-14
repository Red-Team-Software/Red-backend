import { ValueObject } from "src/common/domain";
import { NegativeOrderBundleQuantityException } from "../exceptions/negative-order-bundle-quantity.exception";
import { ZeroQuantityOrderBundleException } from "../exceptions/order-bundle-quantity-zero-exception";

export class OrderBundleQuantity extends ValueObject<OrderBundleQuantity> {
    private quantity: number;

    private constructor(quantity: number) {
        super();

        if(quantity<0) { throw new NegativeOrderBundleQuantityException('Bundle quantityes can not be negative')}

        if(quantity === 0) { throw new ZeroQuantityOrderBundleException('Bundle quantity can not be zero')}

        this.quantity = quantity;
    }

    equals(obj: OrderBundleQuantity): boolean {
        return this.quantity == obj.quantity;
    }

    get OrderBundleQuantity() {
        return this.quantity;
    }

    public static create(quantity: number): OrderBundleQuantity {
        return new OrderBundleQuantity(quantity);
    }
}