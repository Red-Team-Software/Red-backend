import { DomainEvent } from "src/common/domain"
import { BundleId } from "../value-object/bundle-id"
import { BundleName } from "../value-object/bundle-name"

export class BundleUpdatedName extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundleName:this.bundleName.Value,
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        bundleName:BundleName,
    ){
        return new BundleUpdatedName(
            bundleId,
            bundleName,
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundleName:BundleName,
    ){
        super()
    }
}