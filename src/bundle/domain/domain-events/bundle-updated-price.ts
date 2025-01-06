import { DomainEvent } from "src/common/domain"
import { BundleId } from "../value-object/bundle-id"
import { BundlePrice } from "../value-object/bundle-price"

export class BundleUpdatedPrice extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundlePrice:this.bundlePrice
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        bundlePrice:BundlePrice
    ){
        return new BundleUpdatedPrice(
            bundleId,
            bundlePrice,
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundlePrice:BundlePrice
    ){
        super()
    }
}