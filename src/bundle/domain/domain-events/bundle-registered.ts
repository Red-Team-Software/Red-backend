import { DomainEvent } from "src/common/domain"
import { BundleCaducityDate } from "../value-object/bundle-caducity-date"
import { BundleDescription } from "../value-object/bundle-description"
import { BundleId } from "../value-object/bundle-id"
import { BundleImage } from "../value-object/bundle-image"
import { BundleName } from "../value-object/bundle-name"
import { BundlePrice } from "../value-object/bundle-price"
import { BundleStock } from "../value-object/bundle-stock"
import { BundleWeigth } from "../value-object/bundle-weigth"
import { ProductID } from "src/product/domain/value-object/product-id"

export class BundleRegistered extends DomainEvent {
    serialize(): string {
        let data:string= {  
            bundleId:this.bundleId.Value,
            bundleDescription:this.bundleDescription.Value,
            bundleCaducityDate:this.bundleCaducityDate.Value,
            bundleName:this.bundleName.Value,
            bundleStock:this.bundleStock.Value,
            bundleImages:this.bundleImages.map(image=>image.Value),
            bundlePrice:this.bundlePrice,
            bundleWeigth:this.bundleWeigth,
            bundleProductId:this.productId.map(id=>id.Value)
        }.toString()
        //TODO hacerlo con objetos complejos
        
        return data
    }
    static create(
        bundleId:BundleId,
        bundleDescription:BundleDescription,
        bundleCaducityDate:BundleCaducityDate,
        bundleName:BundleName,
        bundleStock:BundleStock,
        bundleImages:BundleImage[],
        bundlePrice:BundlePrice,
        bundleWeigth:BundleWeigth,
        productId:ProductID[]
    ){
        return new BundleRegistered(
            bundleId,
            bundleDescription,
            bundleCaducityDate,
            bundleName,
            bundleStock,
            bundleImages,
            bundlePrice,
            bundleWeigth,
            productId
        )
    }
    constructor(
        public bundleId:BundleId,
        public bundleDescription:BundleDescription,
        public bundleCaducityDate:BundleCaducityDate,
        public bundleName:BundleName,
        public bundleStock:BundleStock,
        public bundleImages:BundleImage[],
        public bundlePrice:BundlePrice,
        public bundleWeigth:BundleWeigth,
        public productId:ProductID[]
    ){
        super()
    }
}