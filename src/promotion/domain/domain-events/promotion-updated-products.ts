import { ProductID } from 'src/product/domain/value-object/product-id';
import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { PromotionId } from '../value-object/promotion-id';
import { PromotionState } from '../value-object/promotion-state';

export class PromotionUpdatedProducts extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            products:this.products.map(product=>product.Value)
        }

        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        products:ProductID[],
    ){
        return new PromotionUpdatedProducts(
            promotionId,
            products
        )
    }
    constructor(
        public promotionId:PromotionId,
        public products:ProductID[],
    ){
        super()
    }
}