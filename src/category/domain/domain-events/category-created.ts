// src/Category/domain/domain-events/category-created.ts

import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "../value-object/category-image";
import { ProductID } from "src/product/domain/value-object/product-id";

export class CategoryCreated extends DomainEvent {
    categoryId: CategoryId;
    categoryName: CategoryName;
    categoryImage: CategoryImage;
    products: ProductID []=[];
    private constructor(categoryId: CategoryId, categoryName: CategoryName, categoryImage:CategoryImage |null, products:ProductID[]) {
        super();
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryImage = categoryImage;
        this.products = products;
    }

    static create(categoryId: CategoryId, categoryName: CategoryName, categoryImage:CategoryImage | null, products: ProductID[]): CategoryCreated {
        return new CategoryCreated(categoryId, categoryName, categoryImage, products);
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
