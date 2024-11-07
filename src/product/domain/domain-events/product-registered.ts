import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductCaducityDate } from '../value-object/product-caducity-date';
import { ProductDescription } from '../value-object/product-description';
import { ProductID } from '../value-object/product-id';
import { ProductImage } from '../value-object/product-image';
import { ProductName } from '../value-object/product-name';
import { ProductPrice } from '../value-object/product-price';
import { ProductStock } from '../value-object/product-stock';
export class ProductRegistered extends DomainEvent {
    serialize(): string {
        return ''
    }
    static create(
        productId:ProductID,
        productDescription:ProductDescription,
        productCaducityDate:ProductCaducityDate,
        productName:ProductName,
        productStock:ProductStock,
        productImage:ProductImage[],
        productPrice:ProductPrice
    ){
        return new ProductRegistered(
            productId,
            productDescription,
            productCaducityDate,
            productName,
            productStock,
            productImage,
            productPrice
        )
    }
    constructor(
        public productId:ProductID,
        public productDescription:ProductDescription,
        public productCaducityDate:ProductCaducityDate,
        public productName:ProductName,
        public productStock:ProductStock,
        public productImage:ProductImage[],
        public productPrice:ProductPrice
    ){
        super()
    }
}