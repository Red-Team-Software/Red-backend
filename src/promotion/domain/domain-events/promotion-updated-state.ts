import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { PromotionId } from '../value-object/promotion-id';
import { PromotionState } from '../value-object/promotion-state';

export class PromotionUpdatedState extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            promotionState:this.promotionState
        }

        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        promotionState:PromotionState
    ){
        return new PromotionUpdatedState(
            promotionId,
            promotionState
        )
    }
    constructor(
        public promotionId:PromotionId,
        public promotionState:PromotionState,
    ){
        super()
    }
}