import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { CategoryID } from '../value-object/category-id';
import { CategoryName } from '../value-object/category-name';

export class CategoryUpdatedName extends DomainEvent {
    serialize(): string {
        let data = {  
            categoryId: this.categoryId.Value,
            categoryName: this.categoryName.Value,
        };
        return JSON.stringify(data);
    }

    static create(
        categoryId: CategoryID,
        categoryName: CategoryName
    ): CategoryUpdatedName {
        return new CategoryUpdatedName(
            categoryId,
            categoryName
        );
    }

    constructor(
        public categoryId: CategoryID,
        public categoryName: CategoryName
    ) {
        super();
    }
}
