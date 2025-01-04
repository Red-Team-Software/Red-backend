import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductID } from '../value-object/product-id';
import { ProductName } from '../value-object/product-name';

export class ProductUpdatedName extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productName:this.productName.Value
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productName:ProductName
    ){
        return new ProductUpdatedName(
            productId,
            productName
        )
    }
    constructor(
        public productId:ProductID,
        public productName:ProductName

    ){
        super()
    }
}