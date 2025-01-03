import { DomainEvent } from "src/common/domain"
import { BundleDescription } from "../value-object/bundle-description"
import { BundleId } from "../value-object/bundle-id"

export class BundleUpdatedDescription extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundleDescription:this.bundleDescription.Value,
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        bundleDescription:BundleDescription
    ){
        return new BundleUpdatedDescription(
            bundleId,
            bundleDescription,
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundleDescription:BundleDescription,
    ){
        super()
    }
}