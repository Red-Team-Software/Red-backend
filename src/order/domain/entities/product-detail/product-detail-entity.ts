import { Entity } from "src/common/domain";
import { ProductDetailId } from "./value_object/product-detail-id";
import { ProductDetailQuantity } from "./value_object/product-detail-quantity";
import { ProductDetailPrice } from "./value_object/product-detail-price";

export class ProductDetail extends Entity<ProductDetailId> {
    
    constructor(
        private productDetailId: ProductDetailId,
        private quantity: ProductDetailQuantity,
        private price: ProductDetailPrice
    ) {
        super(productDetailId);
    }

    static create(
        productDetailId: ProductDetailId,
        quantity: ProductDetailQuantity,
        price: ProductDetailPrice
    ): ProductDetail {
        return new ProductDetail(
            productDetailId,
            quantity,
            price
        );
    }

    get ProductDetailId(): ProductDetailId {
        return this.productDetailId;
    }

    get Quantity(): ProductDetailQuantity {
        return this.quantity;
    }

    get Price(): ProductDetailPrice {
        return this.price;
    }

}