import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductID } from '../value-object/product-id';
import { ProductStock } from '../value-object/product-stock';

export class ProductUpdatedStock extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productStock:this.productStock.Value
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productStock:ProductStock
    ){
        return new ProductUpdatedStock(
            productId,
            productStock
        )
    }
    constructor(
        public productId:ProductID,
        public productStock:ProductStock

    ){
        super()
    }
}