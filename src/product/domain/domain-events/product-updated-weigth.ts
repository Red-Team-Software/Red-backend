import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductID } from '../value-object/product-id';
import { ProductWeigth } from '../value-object/product-weigth';

export class ProductUpdatedWeigth extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productWeigth:this.productWeigth,
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productWeigth:ProductWeigth,
    ){
        return new ProductUpdatedWeigth(
            productId,
            productWeigth
        )
    }
    constructor(
        public productId:ProductID,
        public productWeigth:ProductWeigth,
    ){
        super()
    }
}