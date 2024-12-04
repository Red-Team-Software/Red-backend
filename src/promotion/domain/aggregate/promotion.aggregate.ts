import { AggregateRoot, DomainEvent } from "src/common/domain"
import { PromotionDiscount } from "../value-object/promotion-discount"
import { PromotionId } from "../value-object/promotion-id"
import { ProductID } from "src/product/domain/value-object/product-id"
import { CategoryID } from "src/category/domain/value-object/category-id"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { PromotionDescription } from "../value-object/promotion-description"
import { PromotionName } from "../value-object/promotion-name"
import { PromotionRegistered } from "../domain-events/promotion-registered"
import { PromotionAvaleableState } from '../value-object/promotion-avaleable-state';


export class Promotion extends AggregateRoot <PromotionId>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'promotionRegistered':
                const promotionRegistered: PromotionRegistered = event as PromotionRegistered
                this.promotionDescription = promotionRegistered.promotionDescription
                this.promotionName = promotionRegistered.promotionName

        }
    }
    protected validateState(): void {

    }
    private constructor(
        promotionId:PromotionId,
        private promotionDescription:PromotionDescription,
        private promotionName:PromotionName,
        private promotionAvaleableState:PromotionAvaleableState,
        private promotionDiscount:PromotionDiscount,
        private products:ProductID[],
        private bundles:BundleId[],
        private categories:CategoryID[],
    ){
        super(promotionId)
    }

    static Registerpromotion(
        promotionId:PromotionId,
        promotionDescription:PromotionDescription,
        promotionName:PromotionName,
        promotionAvaleableState:PromotionAvaleableState,
        promotionDiscount:PromotionDiscount,
        products:ProductID[],
        bundles:BundleId[],
        categories:CategoryID[],
    ):Promotion
    {
        const promotion = new Promotion(
            promotionId,
            promotionDescription,
            promotionName,
            promotionAvaleableState,
            promotionDiscount,
            products,
            bundles,
            categories
        )
        promotion.apply(
            PromotionRegistered.create(
                promotionId,
                promotionDescription,
                promotionName,
                promotionAvaleableState,
                promotionDiscount,
                products,
                bundles,
                categories
            )
        )
        promotion.validateState()
        return promotion
    }
    static initializeAggregate(
        promotionId:PromotionId,
        promotionDescription:PromotionDescription,
        promotionName:PromotionName,
        promotionAvaleableState:PromotionAvaleableState,
        promotionDiscount:PromotionDiscount,
        products:ProductID[],
        bundles:BundleId[],
        categories:CategoryID[],
    ):Promotion{
        const promotion = new Promotion(
            promotionId,
            promotionDescription,
            promotionName,
            promotionAvaleableState,
            promotionDiscount,
            products,
            bundles,
            categories
        )
        promotion.validateState()
        return promotion
    }
        
    get PromotionDescription():PromotionDescription{return this.promotionDescription}
    get PromotionName():PromotionName{return this.promotionName}
    get PromotionAvaleableState():PromotionAvaleableState{return this.promotionAvaleableState}
    get PromotionDiscounts():PromotionDiscount{return this.promotionDiscount}
    get Products():ProductID[]{return this.products}
    get Bundles():BundleId[]{return this.bundles}
    get Categories():CategoryID[]{return this.categories}
}