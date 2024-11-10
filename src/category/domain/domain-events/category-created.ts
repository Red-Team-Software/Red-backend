// src/Category/domain/domain-events/category-created.ts

import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";

export class CategoryCreated extends DomainEvent {
    categoryId: CategoryId;
    categoryName: CategoryName;

    private constructor(categoryId: CategoryId, categoryName: CategoryName) {
        super();
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    static create(categoryId: CategoryId, categoryName: CategoryName): CategoryCreated {
        return new CategoryCreated(categoryId, categoryName);
    }

    serialize(): string {
        return JSON.stringify({
            eventName: this.getEventName,
            occurredOn: this.getOcurredOn,
            categoryId: this.categoryId.Value,
            categoryName: this.categoryName.Value
        });
    }
}
