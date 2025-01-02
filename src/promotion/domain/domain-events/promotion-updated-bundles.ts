import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { PromotionId } from '../value-object/promotion-id';

export class PromotionUpdatedBundles extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            bundles:this.bundles.map(bundle=>bundle.Value),
        }

        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        bundles:BundleId[]
    ){
        return new PromotionUpdatedBundles(
            promotionId,
            bundles
        )
    }
    constructor(
        public promotionId:PromotionId,
        public bundles:BundleId[],
    ){
        super()
    }
}