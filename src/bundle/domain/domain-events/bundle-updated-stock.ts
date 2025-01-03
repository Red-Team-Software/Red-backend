import { DomainEvent } from "src/common/domain"
import { BundleId } from "../value-object/bundle-id"
import { BundleStock } from "../value-object/bundle-stock"

export class BundleUpdatedStock extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundleStock:this.bundleStock.Value
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        bundleStock:BundleStock,
    ){
        return new BundleUpdatedStock(
            bundleId,
            bundleStock
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundleStock:BundleStock
    ){
        super()
    }
}