import { DomainEvent } from "src/common/domain"
import { BundleCaducityDate } from "../value-object/bundle-caducity-date"
import { BundleId } from "../value-object/bundle-id"

export class BundleUpdatedCaducityDate extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundleCaducityDate:this.bundleCaducityDate.Value
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        bundleCaducityDate:BundleCaducityDate,
    ){
        return new BundleUpdatedCaducityDate(
            bundleId,
            bundleCaducityDate
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundleCaducityDate:BundleCaducityDate
    ){
        super()
    }
}