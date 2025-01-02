import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { ProductCaducityDate } from '../value-object/product-caducity-date';
import { ProductID } from '../value-object/product-id';

export class ProductUpdatedCaducityDate extends DomainEvent {
    serialize(): string {
        let data= {  
            productId:this.productId.Value,
            productCaducityDate:this.productCaducityDate.Value,
        }
        
        return JSON.stringify(data)
    }
    static create(
        productId:ProductID,
        productCaducityDate:ProductCaducityDate,
    ){
        return new ProductUpdatedCaducityDate(
            productId,
            productCaducityDate
        )
    }
    constructor(
        public productId:ProductID,
        public productCaducityDate:ProductCaducityDate,
    ){
        super()
    }
}