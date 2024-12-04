import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { CategoryID } from "src/category/domain/value-object/category-id"
import { DomainEvent } from "src/common/domain"
import { ProductID } from "src/product/domain/value-object/product-id"
import { PromotionAvaleableState } from "../value-object/promotion-avaleable-state"
import { PromotionDescription } from "../value-object/promotion-description"
import { PromotionDiscount } from "../value-object/promotion-discount"
import { PromotionId } from "../value-object/promotion-id"
import { PromotionName } from "../value-object/promotion-name"

export class PromotionRegistered extends DomainEvent {
    serialize(): string {
        let data= {  
            promotionId:this.promotionId.Value,
            promotionDescription:this.promotionDescription.Value,
            promotionName:this.promotionName,
            promotionAvaleableState:this.promotionAvaleableState,
            promotionDiscount:this.promotionDiscount.Value,
            products:this.products.map(product=>product.Value),
            bundles:this.bundles.map(bundle=>bundle.Value),
            categories:this.categories.map(category=>category.Value)
        }
        
        return JSON.stringify(data)
    }
    static create(
        promotionId:PromotionId,
        promotionDescription:PromotionDescription,
        promotionName:PromotionName,
        promotionAvaleableState:PromotionAvaleableState,
        promotionDiscount:PromotionDiscount,
        products:ProductID[],
        bundles:BundleId[],
        categories:CategoryID[],
    ){
        return new PromotionRegistered(
            promotionId,
            promotionDescription,
            promotionName,
            promotionAvaleableState,
            promotionDiscount,
            products,
            bundles,
            categories
        )
    }
    constructor(
        public promotionId:PromotionId,
        public promotionDescription:PromotionDescription,
        public promotionName:PromotionName,
        public promotionAvaleableState:PromotionAvaleableState,
        public promotionDiscount:PromotionDiscount,
        public products:ProductID[],
        public bundles:BundleId[],
        public categories:CategoryID[],
    ){
        super()
    }
}