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
            productName:this.productName.Value,
            productStock:this.productStock.Value,
            productImage:this.productImage.map(image=>image.Value),
            productPrice:this.productPrice,
            productWeigth:this.productWeigth,
            productCaducityDate:this.productCaducityDate 
            ? this.productCaducityDate.Value
            : null
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productDescription:ProductDescription,
        productName:ProductName,
        productStock:ProductStock,
        productImage:ProductImage[],
        productPrice:ProductPrice,
        productWeigth:ProductWeigth,
        productCaducityDate?:ProductCaducityDate,
    ){
        return new ProductRegistered(
            productId,
            productDescription,
            productName,
            productStock,
            productImage,
            productPrice,
            productWeigth,
            productCaducityDate
            ? productCaducityDate
            : null
        )
    }
    constructor(
        public productId:ProductID,
        public productDescription:ProductDescription,
        public productName:ProductName,
        public productStock:ProductStock,
        public productImage:ProductImage[],
        public productPrice:ProductPrice,
        public productWeigth:ProductWeigth,
        public productCaducityDate?:ProductCaducityDate,
    ){
        super()
    }
}