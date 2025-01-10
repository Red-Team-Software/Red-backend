import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { PromotionDescription } from '../value-object/promotion-description';
import { PromotionId } from '../value-object/promotion-id';

export class PromotionUpdatedDescription extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            promotionDescription:this.promotionDescription.Value
        }

        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        promotionDescription:PromotionDescription,
        
    ){
        return new PromotionUpdatedDescription(
            promotionId,
            promotionDescription
        )
    }
    constructor(
        public promotionId:PromotionId,
        public promotionDescription:PromotionDescription,
    ){
        super()
    }
}