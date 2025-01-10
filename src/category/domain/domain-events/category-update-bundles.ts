import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { CategoryID } from '../value-object/category-id';
import { BundleId } from '../../../bundle/domain/value-object/bundle-id';

export class CategoryUpdatedBundles extends DomainEvent {
    serialize(): string {
        let data = {  
            categoryId: this.categoryId.Value,
            bundles: this.bundles.map(bundleId => bundleId.Value),
        };
        return JSON.stringify(data);
    }

    static create(
        categoryId: CategoryID,
        bundles: BundleId[]
    ): CategoryUpdatedBundles {
        return new CategoryUpdatedBundles(
            categoryId,
            bundles
        );
    }

    constructor(
        public categoryId: CategoryID,
        public bundles: BundleId[]
    ) {
        super();
    }
}
