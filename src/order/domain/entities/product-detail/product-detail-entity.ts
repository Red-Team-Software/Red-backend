import { Entity } from "src/common/domain";
import { ProductDetailId } from "./value_object/product-detail-id";
import { ProductDetailQuantity } from "./value_object/product-detail-quantity";

export class ProductDetail extends Entity<ProductDetailId> {
    
    constructor(
        private productDetailId: ProductDetailId,
        private quantity: ProductDetailQuantity
    ) {
        super(productDetailId);
    }

    static create(
        productDetailId: ProductDetailId,
        quantity: ProductDetailQuantity
    ): ProductDetail {
        return new ProductDetail(
            productDetailId,
            quantity
        );
    }

    get ProductDetailId(): ProductDetailId {
        return this.productDetailId;
    }

    get Quantity(): ProductDetailQuantity {
        return this.quantity;
    }

}