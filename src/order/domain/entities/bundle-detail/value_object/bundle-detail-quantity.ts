import { ValueObject } from "src/common/domain";
import { NegativeBundleDetailQuantityException } from "../exceptions/negative-bundle-detail-quantity.exception";
import { ZeroQuantityBundleDetailException } from "../exceptions/bundle-detail-quantity-zero-exception";

export class BundleDetailQuantity extends ValueObject<BundleDetailQuantity> {
    private quantity: number;

    private constructor(quantity: number) {
        super();

        if(quantity<0) { throw new NegativeBundleDetailQuantityException('Bundle quantityes can not be negative')}

        if(quantity === 0) { throw new ZeroQuantityBundleDetailException('Bundle quantity can not be zero')}

        this.quantity = quantity;
    }

    equals(obj: BundleDetailQuantity): boolean {
        return this.quantity == obj.quantity;
    }

    get Quantity() {
        return this.quantity;
    }

    public static create(quantity: number): BundleDetailQuantity {
        return new BundleDetailQuantity(quantity);
    }
}