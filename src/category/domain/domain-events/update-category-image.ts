import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { CategoryID } from '../value-object/category-id';
import { CategoryImage } from '../value-object/category-image';

export class CategoryUpdatedImage extends DomainEvent {
    serialize(): string {
        let data = {  
            categoryId: this.categoryId.Value,
            categoryImage: this.categoryImage.Value,
        };
        return JSON.stringify(data);
    }

    static create(
        categoryId: CategoryID,
        categoryImage: CategoryImage
    ): CategoryUpdatedImage {
        return new CategoryUpdatedImage(
            categoryId,
            categoryImage
        );
    }

    constructor(
        public categoryId: CategoryID,
        public categoryImage: CategoryImage
    ) {
        super();
    }
}
