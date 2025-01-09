import { Entity } from "src/common/domain";
import { BundleDetailId } from "./value_object/bundle-detail-id";
import { BundleDetailQuantity } from "./value_object/bundle-detail-quantity";
import { BundleDetailPrice } from "./value_object/bundle-detail-price";


export class BundleDetail extends Entity<BundleDetailId> {
    
    constructor(
        private bundleDetailId: BundleDetailId,
        private quantity: BundleDetailQuantity,
        private price: BundleDetailPrice
    ) {
        super(bundleDetailId);
    }

    static create(
        bundleDetailId: BundleDetailId,
        quantity: BundleDetailQuantity,
        price: BundleDetailPrice
    ): BundleDetail {
        return new BundleDetail(
            bundleDetailId,
            quantity,
            price
        );
    }

    get BundleDetailId(): BundleDetailId {
        return this.bundleDetailId;
    }

    get Quantity(): BundleDetailQuantity {
        return this.quantity;
    }

    get Price(): BundleDetailPrice {
        return this.price;
    }
}