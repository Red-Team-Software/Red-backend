// src/Category/domain/domain-events/category-created.ts

import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "../value-object/category-image";
import { ProductID } from "src/product/domain/value-object/product-id";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";

export class CategoryCreated extends DomainEvent {
    categoryId: CategoryID;
    categoryName: CategoryName;
    categoryImage: CategoryImage;
    products: ProductID[] = [];
    bundles: BundleId[] = [];

    private constructor(
        categoryId: CategoryID,
        categoryName: CategoryName,
        categoryImage: CategoryImage | null,
        products?: ProductID[],
        bundles?: BundleId[]
    ) {
        super();
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryImage = categoryImage;
        this.products = products || [];
        this.bundles = bundles || []; 
    }

    static create(
        categoryId: CategoryID,
        categoryName: CategoryName,
        categoryImage: CategoryImage | null,
        products: ProductID[] = [], 
        bundles: BundleId[] = [] 
    ): CategoryCreated {
        return new CategoryCreated(categoryId, categoryName, categoryImage, products, bundles);
    }

    serialize(): string {
        return JSON.stringify({
            eventName: this.getEventName,
            occurredOn: this.getOcurredOn,
            categoryId: this.categoryId.Value,
            categoryName: this.categoryName.Value,
            categoryImage: this.categoryImage.Value,
            products: this.products.map(product => product.Value),
            bundles: this.bundles.map(bundle => bundle.Value)
        });
    }
}
