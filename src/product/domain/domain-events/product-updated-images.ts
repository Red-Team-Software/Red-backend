import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductID } from '../value-object/product-id';
import { ProductImage } from '../value-object/product-image';

export class ProductUpdatedImages extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productImages:this.productImage.map(image=>image.Value),
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productImages:ProductImage[],
    ){
        return new ProductUpdatedImages(
            productId,
            productImages
        )
    }
    constructor(
        public productId:ProductID,
        public productImage:ProductImage[],
    ){
        super()
    }
}