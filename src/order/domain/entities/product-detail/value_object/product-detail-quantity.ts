import { ValueObject } from "src/common/domain";
import { ZeroQuantityProductDetailException } from "../exceptions/product-detail-quantity-zero-exception";
import { NegativeProductDetailQuantityException } from "../exceptions/negative-product-detail-quantity.exception";


export class ProductDetailQuantity extends ValueObject<ProductDetailQuantity> {
    private quantity: number;

    private constructor(quantity: number) {
        super();

        if(quantity<0) { throw new NegativeProductDetailQuantityException('Product quantityes can not be negative')}

        if(quantity === 0) { throw new ZeroQuantityProductDetailException('The quantity of the order can not be zero')}

        this.quantity = quantity;
    }

    equals(obj: ProductDetailQuantity): boolean {
        return this.quantity == obj.quantity;
    }

    get Quantity() {
        return this.quantity;
    }

    public static create(quantity: number): ProductDetailQuantity {
        return new ProductDetailQuantity(quantity);
    }
}