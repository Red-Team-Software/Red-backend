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
import { PromotionUpdatedProducts } from "../domain-events/promotion-updated-products"
import { PromotionUpdatedBundles } from "../domain-events/promotion-updated-bundles"
import { PromotionUpdatedCategories } from "../domain-events/promotion-updated-categories"
import { InvaliPromotionException } from "../domain-exceptions/invalid-promotion-exception"
import { InvalidPromotionProductsIdException } from "../domain-exceptions/invalid-promotion-products-id-exception"
import { InvalidPromotionBundlesIdException } from "../domain-exceptions/invalid-promotion-bundles-id-exception"
import { InvalidPromotionCategoriesIdException } from "../domain-exceptions/invalid-promotion-categories-id-exception"


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
            case 'PromotionUpdatedProducts':
                const promotionUpdatedProducts: PromotionUpdatedProducts = event as PromotionUpdatedProducts
                this.products=promotionUpdatedProducts.products
                break;
            case 'PromotionUpdatedBundles':
                const promotionUpdatedBundles: PromotionUpdatedBundles = event as PromotionUpdatedBundles
                this.bundles=promotionUpdatedBundles.bundles=promotionUpdatedBundles.bundles
                break;
            case 'PromotionUpdatedCategories':
                const promotionUpdatedCategories: PromotionUpdatedCategories = event as PromotionUpdatedCategories
                this.categories=promotionUpdatedCategories.categories
                break;
        }
    }

    protected validateProducts():void{
        for(const productId of this.products){
            let elements=this.products.filter(product=>
                productId.equals(product)
            )
        if (elements.length!==1)
            throw new InvalidPromotionProductsIdException(productId.Value,elements.length)
        }
    }

    protected validateBundles():void{
        for(const bundleId of this.bundles){
            let elements=this.bundles.filter(product=>
                bundleId.equals(product)
            )
        if (elements.length!==1)
            throw new InvalidPromotionBundlesIdException(bundleId.Value,elements.length)
        }
    }

    protected validateCategories():void{
        for(const categoryId of this.categories){
            let elements=this.categories.filter(category=>
                categoryId.equals(category)
            )
        if (elements.length!==1)
            throw new InvalidPromotionCategoriesIdException(categoryId.Value,elements.length)
        }
    }

    protected validateState(): void {
        if(
            !this.getId() ||
            !this.PromotionDescription ||
            !this.promotionName ||
            !this.promotionState ||
            !this.promotionDiscount ||
            !this.products ||
            !this.bundles ||
            !this.categories
        )
        throw new InvaliPromotionException()

        this.validateProducts()
        this.validateBundles()
        this.validateCategories()
        
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

    updateProducts(products:ProductID[]){
        this.apply(
            PromotionUpdatedProducts.create(
                this.getId(),
                products
            )
        )  
    }

    updateBundles(bundles:BundleId[]){
        this.apply(
            PromotionUpdatedBundles.create(
                this.getId(),
                bundles
            )
        )  
    }

    updateCategories(categories:CategoryID[]){
        this.apply(
            PromotionUpdatedCategories.create(
                this.getId(),
                categories
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