import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductCaducityDate } from '../value-object/product-caducity-date';
import { ProductDescription } from '../value-object/product-description';
import { ProductID } from '../value-object/product-id';
import { ProductImage } from '../value-object/product-image';
import { ProductName } from '../value-object/product-name';
import { ProductPrice } from '../value-object/product-price';
import { ProductStock } from '../value-object/product-stock';
import { ProductWeigth } from '../value-object/product-weigth';
export class ProductRegistered extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productDescription:this.productDescription.Value,
            productCaducityDate:this.productCaducityDate.Value,
            productName:this.productName.Value,
            productStock:this.productStock.Value,
            productImage:this.productImage.map(image=>image.Value),
            productPrice:this.productPrice,
            productWeigth:this.productWeigth         
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productDescription:ProductDescription,
        productCaducityDate:ProductCaducityDate,
        productName:ProductName,
        productStock:ProductStock,
        productImage:ProductImage[],
        productPrice:ProductPrice,
        productWeigth:ProductWeigth
    ){
        return new ProductRegistered(
            productId,
            productDescription,
            productCaducityDate,
            productName,
            productStock,
            productImage,
            productPrice,
            productWeigth
        )
    }
    constructor(
        public productId:ProductID,
        public productDescription:ProductDescription,
        public productCaducityDate:ProductCaducityDate,
        public productName:ProductName,
        public productStock:ProductStock,
        public productImage:ProductImage[],
        public productPrice:ProductPrice,
        public productWeigth:ProductWeigth
    ){
        super()
    }
}