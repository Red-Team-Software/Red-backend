import { AggregateRoot, DomainEvent, Entity } from "src/common/domain";
import { ProductID } from "../value-object/product-id";
import { ProductCaducityDate } from "../value-object/product-caducity-date";
import { ProductDescription } from "../value-object/product-description";
import { ProductName } from "../value-object/product-name";
import { ProductStock } from "../value-object/product-stock";
import { ProductRegistered } from "../domain-events/product-registered";
import { ProductImage } from "../value-object/product-image";
import { ProductPrice } from "../value-object/product-price";
import { ProductWeigth } from "../value-object/product-weigth";
import { ProductDeleted } from "../domain-events/product-deleted";
import { ProductUpdatedDescription } from "../domain-events/product-updated-description";
import { ProductUpdatedName } from "../domain-events/product-updated-name";
import { ProductUpdatedStock } from "../domain-events/product-updated-stock";
import { ProductUpdatedImages } from "../domain-events/product-updated-images";
import { ProductUpdatedPrice } from "../domain-events/product-updated-price";
import { ProductUpdatedWeigth } from "../domain-events/product-updated-weigth";
import { ProductUpdatedCaducityDate } from "../domain-events/product-updated-caducity-date";

export class Product extends AggregateRoot <ProductID>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'ProductRegistered':
                const productRegistered: ProductRegistered = event as ProductRegistered
                this.productDescription = productRegistered.productDescription
                this.productCaducityDate = productRegistered.productCaducityDate
                this.productName = productRegistered.productName
                this.productStock = productRegistered.productStock
                this.productImages= productRegistered.productImage
                this.productPrice= productRegistered.productPrice
                this.productWeigth= productRegistered.productWeigth
                break;
            case 'ProductUpdatedName':
                const productUpdatedName= event as ProductUpdatedName
                this.productName=productUpdatedName.productName
                break;
            case 'ProductUpdatedDescription':
                const productUpdatedDescription= event as ProductUpdatedDescription
                this.productDescription=productUpdatedDescription.productDescription
                break;
            case 'ProductUpdatedStock':
                const productUpdatedStock= event as ProductUpdatedStock
                this.productStock=productUpdatedStock.productStock
                break;
            case 'ProductUpdatedImages':
                const productUpdatedImages= event as ProductUpdatedImages
                this.productImages=productUpdatedImages.productImage
                break;
            case 'ProductUpdatedPrice':
                const productUpdatedPrice= event as ProductUpdatedPrice
                this.productPrice=productUpdatedPrice.productPrice
                break;
            case 'ProductUpdatedWeigth':
                const productUpdatedWeigth= event as ProductUpdatedWeigth
                this.productWeigth=productUpdatedWeigth.productWeigth
                break;
        }
    }
    protected validateState(): void {

    }
    private constructor(
        productId:ProductID,
        private productDescription:ProductDescription,
        private productName:ProductName,
        private productStock:ProductStock,
        private productImages:ProductImage[],
        private productPrice:ProductPrice,
        private productWeigth:ProductWeigth,
        private productCaducityDate?:ProductCaducityDate,
    ){
        super(productId)
    }

    delete(id:ProductID):void{
        this.apply(
            ProductDeleted.create(id)
        )
    }

    updateDescription(description:ProductDescription):void{
        this.apply(
            ProductUpdatedDescription.create(
                this.getId(),
                description
            )
        )
    }

    updateName(name:ProductName):void{
        this.apply(
            ProductUpdatedName.create(
                this.getId(),
                name
            )
        )
    }

    updateStock(stock:ProductStock):void{
        this.apply(
            ProductUpdatedStock.create(
                this.getId(),
                stock
            )
        )
    }

    updateImages(images:ProductImage[]){
        this.apply(
            ProductUpdatedImages.create(
                this.getId(),
                images
            )
        )
    }

    updateCurrency(price:ProductPrice){
        this.apply(
            ProductUpdatedPrice.create(
                this.getId(),
                price
            )
        )
    }

    updateWeigth(weigth:ProductWeigth){
        this.apply(
            ProductUpdatedWeigth.create(
                this.getId(),
                weigth
            )
        )
    }

    updateCaducityDate(caducityDate:ProductCaducityDate){
        this.apply(
            ProductUpdatedCaducityDate.create(
                this.getId(),
                caducityDate
            )
        )
    }

    static RegisterProduct(
        productId:ProductID,
        productDescription:ProductDescription,
        productName:ProductName,
        productStock:ProductStock,
        productImages:ProductImage[],
        productPrice:ProductPrice,
        productWeigth:ProductWeigth,
        productCaducityDate?:ProductCaducityDate
    ):Product{
        const product = new Product(
            productId,
            productDescription,
            productName,
            productStock,
            productImages,
            productPrice,
            productWeigth,
            productCaducityDate
            ? productCaducityDate
            : null
        )
        product.apply(
            ProductRegistered.create(
                productId,
                productDescription,
                productName,
                productStock,
                productImages,
                productPrice,
                productWeigth,
                productCaducityDate
            )
        )
        return product
    }
    static initializeAggregate(
        productId:ProductID,
        productDescription:ProductDescription,
        productName:ProductName,
        productStock:ProductStock,
        productImages:ProductImage[],
        productPrice:ProductPrice,
        productWeigth:ProductWeigth,
        productCaducityDate?:ProductCaducityDate
    ):Product{
        const product = new Product(
            productId,
            productDescription,
            productName,
            productStock,
            productImages,
            productPrice,
            productWeigth,
            productCaducityDate
        )
        product.validateState()
        return product
    }
    get ProductDescription():ProductDescription{return this.productDescription}
    get ProductCaducityDate():ProductCaducityDate{return this.productCaducityDate}
    get ProductName():ProductName{return this.productName}
    get ProductStock():ProductStock{return this.productStock}
    get ProductImages():ProductImage[]{return this.productImages}
    get ProductPrice():ProductPrice{return this.productPrice}
    get ProductWeigth():ProductWeigth{return this.productWeigth}
}