import { AggregateRoot, DomainEvent, Entity } from "src/common/domain";
import { ProductID } from "../value-object/product-id";
import { ProductCaducityDate } from "../value-object/product-caducity-date";
import { ProductDescription } from "../value-object/product-description";
import { ProductName } from "../value-object/product-name";
import { ProductStock } from "../value-object/product-stock";
import { ProductRegistered } from "../domain-events/product-registered";
import { ProductImage } from "../value-object/product-image";
import { ProductPrice } from "../value-object/product-price";

export class Product extends AggregateRoot <ProductID>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'ProductRegistered':
                const productRegistered: ProductRegistered = event as ProductRegistered
                this.productDescription = productRegistered.productDescription
                this.productCaducityDate = productRegistered.productCaducityDate
                this.productName = productRegistered.productName
                this.productStock = productRegistered.productStock
        }
    }
    protected validateState(): void {

    }
    private constructor(
        productId:ProductID,
        private productDescription:ProductDescription,
        private productCaducityDate:ProductCaducityDate,
        private productName:ProductName,
        private productStock:ProductStock,
        private productImages:ProductImage[],
        private productPrice:ProductPrice
    ){
        super(productId)
    }

    static RegisterProduct(
        productId:ProductID,
        productDescription:ProductDescription,
        productCaducityDate:ProductCaducityDate,
        productName:ProductName,
        productStock:ProductStock,
        productImages:ProductImage[],
        productPrice:ProductPrice
    ):Product{
        const product = new Product(
            productId,
            productDescription,
            productCaducityDate,
            productName,
            productStock,
            productImages,
            productPrice
        )
        product.when(
            ProductRegistered.create(
                productId,
                productDescription,
                productCaducityDate,
                productName,
                productStock,
                productImages,
                productPrice
            )
        )
        return product
    }
    static initializeAggregate(
        productId:ProductID,
        productDescription:ProductDescription,
        productCaducityDate:ProductCaducityDate,
        productName:ProductName,
        productStock:ProductStock,
        productImages:ProductImage[],
        productPrice:ProductPrice
    ):Product{
        const product = new Product(
            productId,
            productDescription,
            productCaducityDate,
            productName,
            productStock,
            productImages,
            productPrice
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
}