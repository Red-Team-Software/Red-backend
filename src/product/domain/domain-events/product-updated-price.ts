import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductID } from '../value-object/product-id';
import { ProductPrice } from '../value-object/product-price';

export class ProductUpdatedPrice extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productPrice:this.productPrice,
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productPrice:ProductPrice,
    ){
        return new ProductUpdatedPrice(
            productId,
            productPrice
        )
    }
    constructor(
        public productId:ProductID,
        public productPrice:ProductPrice,
    ){
        super()
    }
}