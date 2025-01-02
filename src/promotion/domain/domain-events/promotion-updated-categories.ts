import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { PromotionId } from '../value-object/promotion-id';
import { CategoryID } from 'src/category/domain/value-object/category-id';

export class PromotionUpdatedCategories extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            categories:this.categories.map(category=>category.Value)
        }

        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        categories:CategoryID[],
    ){
        return new PromotionUpdatedCategories(
            promotionId,
            categories
        )
    }
    constructor(
        public promotionId:PromotionId,
        public categories:CategoryID[],
    ){
        super()
    }
}