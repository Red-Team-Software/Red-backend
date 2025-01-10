import { DomainEvent } from "src/common/domain"
import { BundleId } from "../value-object/bundle-id"
import { BundleWeigth } from "../value-object/bundle-weigth"

export class BundleUpdatedWeigth extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundleWeigth:this.bundleWeigth
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        bundleWeigth:BundleWeigth
    ){
        return new BundleUpdatedWeigth(
            bundleId,
            bundleWeigth
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundleWeigth:BundleWeigth
    ){
        super()
    }
}