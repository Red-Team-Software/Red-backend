import { Entity } from "src/common/domain";
import { BundleDetailId } from "./value_object/bundle-detail-id";
import { BundleDetailQuantity } from "./value_object/bundle-detail-quantity";


export class BundleDetail extends Entity<BundleDetailId> {
    
    constructor(
        private bundleDetailId: BundleDetailId,
        private quantity: BundleDetailQuantity
    ) {
        super(bundleDetailId);
    }

    static create(
        bundleDetailId: BundleDetailId,
        quantity: BundleDetailQuantity
    ): BundleDetail {
        return new BundleDetail(
            bundleDetailId,
            quantity
        );
    }

    get BundleDetailId(): BundleDetailId {
        return this.bundleDetailId;
    }

    get Quantity(): BundleDetailQuantity {
        return this.quantity;
    }
}