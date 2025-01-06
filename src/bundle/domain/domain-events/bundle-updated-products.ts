import { DomainEvent } from "src/common/domain"
import { BundleId } from "../value-object/bundle-id"
import { ProductID } from "src/product/domain/value-object/product-id"

export class BundleUpdatedProducts extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundleProductId:this.productId.map(id=>id.Value)
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        productId:ProductID[]
    ){
        return new BundleUpdatedProducts(
            bundleId,
            productId
        )
    }
    constructor(
        public bundleId:BundleId,
        public productId:ProductID[]
    ){
        super()
    }
}