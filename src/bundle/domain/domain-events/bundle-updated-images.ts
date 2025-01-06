import { DomainEvent } from "src/common/domain"
import { BundleId } from "../value-object/bundle-id"
import { BundleImage } from "../value-object/bundle-image"

export class BundleUpdatedImages extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value,
            bundleImages:this.bundleImages.map(image=>image.Value),
        }

        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId,
        bundleImages:BundleImage[],
    ){
        return new BundleUpdatedImages(
            bundleId,
            bundleImages
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundleImages:BundleImage[]
    ){
        super()
    }
}