import { ValueObject } from "src/common/domain";
import { NegativeOrderProductQuantityException } from "../exceptions/negative-order-bundle-quantity.exception";
import { ZeroQuantityOrderProductException } from "../exceptions/order-product-quantity-zero-exception";


export class OrderProductQuantity extends ValueObject<OrderProductQuantity> {
    private quantity: number;

    private constructor(quantity: number) {
        super();

        if(quantity<0) { throw new NegativeOrderProductQuantityException('Product quantityes can not be negative')}

        if(quantity === 0) { throw new ZeroQuantityOrderProductException('The quantity of the order can not be zero')}

        this.quantity = quantity;
    }

    equals(obj: OrderProductQuantity): boolean {
        return this.quantity == obj.quantity;
    }

    get Quantity() {
        return this.quantity;
    }

    public static create(quantity: number): OrderProductQuantity {
        return new OrderProductQuantity(quantity);
    }
}