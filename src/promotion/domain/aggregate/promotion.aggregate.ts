import { AggregateRoot, DomainEvent } from "src/common/domain"
import { PromotionDiscount } from "../value-object/promotion-discount"
import { PromotionId } from "../value-object/promotion-id"
import { ProductID } from "src/product/domain/value-object/product-id"
import { CategoryID } from "src/category/domain/value-object/category-id"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { PromotionDescription } from "../value-object/promotion-description"
import { PromotionName } from "../value-object/promotion-name"
import { PromotionRegistered } from "../domain-events/promotion-registered"
import { PromotionState } from "../value-object/promotion-state"
import { PromotionUpdatedDescription } from "../domain-events/promotion-updated-description"
import { PromotionUpdatedName } from "../domain-events/promotion-updated-name"
import { PromotionUpdatedState } from "../domain-events/promotion-updated-state"
import { PromotionUpdatedDiscount } from "../domain-events/promotion-updated-discount"


export class Promotion extends AggregateRoot <PromotionId>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'promotionRegistered':
                const promotionRegistered: PromotionRegistered = event as PromotionRegistered
                this.promotionDescription = promotionRegistered.promotionDescription
                this.promotionName = promotionRegistered.promotionName
                break;
            case 'PromotionUpdatedDescription':
                const promotionUpdatedDescription: PromotionUpdatedDescription = event as PromotionUpdatedDescription
                this.promotionDescription=promotionUpdatedDescription.promotionDescription
                break;
            case 'PromotionUpdatedName':
                const promotionUpdatedName: PromotionUpdatedName = event as PromotionUpdatedName
                this.promotionName=promotionUpdatedName.promotionName
                break;
            case 'PromotionUpdatedState':
                const promotionUpdatedState: PromotionUpdatedState = event as PromotionUpdatedState
                this.promotionState=promotionUpdatedState.promotionState
                break;
            case 'PromotionUpdatedDiscount':
                const promotionUpdatedDiscount: PromotionUpdatedDiscount = event as PromotionUpdatedDiscount
                this.promotionDiscount=promotionUpdatedDiscount.promotionDiscount
                break;
        }
    }
    protected validateState(): void {

    }
    private constructor(
        promotionId:PromotionId,
        private promotionDescription:PromotionDescription,
        private promotionName:PromotionName,
        private promotionState:PromotionState,
        private promotionDiscount:PromotionDiscount,
        private products:ProductID[],
        private bundles:BundleId[],
        private categories:CategoryID[],
    ){
        super(promotionId)
    }

    updateDescription(description:PromotionDescription):void{
            this.apply(
                PromotionUpdatedDescription.create(
                    this.getId(),
                    description
                )
            )
        }
    
    updateName(name:PromotionName):void{
        this.apply(
            PromotionUpdatedName.create(
                this.getId(),
                name
            )
        )
    }

    updateState(state:PromotionState):void{
        this.apply(
            PromotionUpdatedState.create(
                this.getId(),
                state
            )
        )
    }

    updateDiscount(discount:PromotionDiscount):void{
        this.apply(
            PromotionUpdatedDiscount.create(
                this.getId(),
                discount
            )
        )
    }

    static Registerpromotion(
        promotionId:PromotionId,
        promotionDescription:PromotionDescription,
        promotionName:PromotionName,
        promotionState:PromotionState,
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
            promotionState,
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
                promotionState,
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
        promotionState:PromotionState,
        promotionDiscount:PromotionDiscount,
        products:ProductID[],
        bundles:BundleId[],
        categories:CategoryID[],
    ):Promotion{
        const promotion = new Promotion(
            promotionId,
            promotionDescription,
            promotionName,
            promotionState,
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
    get PromotionState():PromotionState{return this.promotionState}
    get PromotionDiscounts():PromotionDiscount{return this.promotionDiscount}
    get Products():ProductID[]{return this.products}
    get Bundles():BundleId[]{return this.bundles}
    get Categories():CategoryID[]{return this.categories}
}