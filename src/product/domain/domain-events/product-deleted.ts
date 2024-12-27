import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductID } from '../value-object/product-id';

export class ProductDeleted extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID
    ){
        return new ProductDeleted(
            productId
        )
    }
    constructor(
        public productId:ProductID
    ){
        super()
    }
}