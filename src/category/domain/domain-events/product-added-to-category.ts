// src/Category/domain/domain-events/product-added-to-category.ts

import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { ProductID } from "src/product/domain/value-object/product-id";

export class ProductAddedToCategory extends DomainEvent {
    categoryId: CategoryId;
    productId: ProductID;

    private constructor(categoryId: CategoryId, productId: ProductID) {
        super();
        this.categoryId = categoryId;
        this.productId = productId;
    }

    static create(categoryId: CategoryId, productId: ProductID): ProductAddedToCategory {
        return new ProductAddedToCategory(categoryId, productId);
    }

    serialize(): string {
        return JSON.stringify({
            eventName: this.getEventName,
            occurredOn: this.getOcurredOn,
            categoryId: this.categoryId.Value,
            productId: this.productId.Value
        });
    }
}
