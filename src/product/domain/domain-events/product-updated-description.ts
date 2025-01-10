import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductDescription } from '../value-object/product-description';
import { ProductID } from '../value-object/product-id';

export class ProductUpdatedDescription extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productDescription:this.productDescription.Value
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productDescription:ProductDescription
        
    ){
        return new ProductUpdatedDescription(
            productId,
            productDescription
        )
    }
    constructor(
        public productId:ProductID,
        public productDescription:ProductDescription

    ){
        super()
    }
}