import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { PromotionDiscount } from '../value-object/promotion-discount';
import { PromotionId } from '../value-object/promotion-id';
import { PromotionState } from '../value-object/promotion-state';

export class PromotionUpdatedDiscount extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            promotionDiscount:this.promotionDiscount.Value
        }

        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        promotionDiscount:PromotionDiscount
    ){
        return new PromotionUpdatedDiscount(
            promotionId,
            promotionDiscount
        )
    }
    constructor(
        public promotionId:PromotionId,
        public promotionDiscount:PromotionDiscount
    ){
        super()
    }
}