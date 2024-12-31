import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { PromotionId } from '../value-object/promotion-id';
import { PromotionName } from '../value-object/promotion-name';

export class PromotionUpdatedName extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            promotionName:this.promotionName.Value
        }

        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        promotionName:PromotionName,
        
    ){
        return new PromotionUpdatedName(
            promotionId,
            promotionName
        )
    }
    constructor(
        public promotionId:PromotionId,
        public promotionName:PromotionName,
    ){
        super()
    }
}