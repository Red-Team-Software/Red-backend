import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { CategoryID } from '../value-object/category-id';
import { ProductID } from '../../../product/domain/value-object/product-id';

export class CategoryUpdatedProducts extends DomainEvent {
    serialize(): string {
        let data = {  
            categoryId: this.categoryId.Value,
            products: this.products.map(productId => productId.Value),
        };
        return JSON.stringify(data);
    }

    static create(
        categoryId: CategoryID,
        products: ProductID[]
    ): CategoryUpdatedProducts {
        return new CategoryUpdatedProducts(
            categoryId,
            products
        );
    }

    constructor(
        public categoryId: CategoryID,
        public products: ProductID[]
    ) {
        super();
    }
}
