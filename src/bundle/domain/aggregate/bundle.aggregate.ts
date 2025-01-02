import { AggregateRoot, DomainEvent} from "src/common/domain";
import { BundleRegistered } from "../domain-events/bundle-registered";
import { BundleId } from "../value-object/bundle-id";
import { BundleDescription } from "../value-object/bundle-description";
import { BundleCaducityDate } from "../value-object/bundle-caducity-date";
import { BundleName } from "../value-object/bundle-name";
import { BundleStock } from "../value-object/bundle-stock";
import { BundleImage } from "../value-object/bundle-image";
import { BundlePrice } from "../value-object/bundle-price";
import { BundleWeigth } from "../value-object/bundle-weigth";
import { ProductID } from "src/product/domain/value-object/product-id";
import { InvalidBundleException } from "../domain-exceptions/invalid-bundle-exception";
import { InvalidBundleProductsIdException } from "../domain-exceptions/invalid-bundle-products-id-exception";

export class Bundle extends AggregateRoot <BundleId>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'BundleRegistered':
                const bundleRegistered: BundleRegistered = event as BundleRegistered
                this.bundleDescription = bundleRegistered.bundleDescription
                this.bundleCaducityDate = bundleRegistered.bundleCaducityDate
                this.bundleName = bundleRegistered.bundleName
                this.bundleStock = bundleRegistered.bundleStock
                this.bundleImages= bundleRegistered.bundleImages
                this.bundlePrice= bundleRegistered.bundlePrice
                this.bundleWeigth= bundleRegistered.bundleWeigth
                this.productsId=bundleRegistered.productId
        }
    }

    protected validateState(): void {
        if (! this.bundleDescription ||
        ! this.bundleDescription ||
        ! this.bundleName ||
        ! this.bundleStock ||
        ! this.bundleImages ||
        ! this.bundlePrice ||
        ! this.bundleWeigth ||
        this.productsId.length<2)
        throw new InvalidBundleException()

        for(const productId of this.productsId){
            let elements=this.productsId.filter(product=>
                productId.equals(product)
            )
            if (elements.length!==1)
                throw new InvalidBundleProductsIdException(productId.Value,elements.length)
        }
    }
    private constructor(
        bundleId:BundleId,
        private bundleDescription:BundleDescription,
        private bundleName:BundleName,
        private bundleStock:BundleStock,
        private bundleImages:BundleImage[],
        private bundlePrice:BundlePrice,
        private bundleWeigth:BundleWeigth,
        private productsId:ProductID[],
        private bundleCaducityDate?:BundleCaducityDate,
    ){
        super(bundleId)
    }

    static Registerbundle(
        bundleId:BundleId,
        bundleDescription:BundleDescription,
        bundleName:BundleName,
        bundleStock:BundleStock,
        bundleImages:BundleImage[],
        bundlePrice:BundlePrice,
        bundleWeigth:BundleWeigth,
        productId:ProductID[],
        bundleCaducityDate?:BundleCaducityDate,
    ):Bundle{
        const bundle = new Bundle(
            bundleId,
            bundleDescription,
            bundleName,
            bundleStock,
            bundleImages,
            bundlePrice,
            bundleWeigth,
            productId,
            bundleCaducityDate
            ? bundleCaducityDate
            : null
        )
        bundle.apply(
            BundleRegistered.create(
                bundleId,
                bundleDescription,
                bundleName,
                bundleStock,
                bundleImages,
                bundlePrice,
                bundleWeigth,
                productId,
                bundleCaducityDate
            )
        )
        bundle.validateState()

        return bundle
    }
    static initializeAggregate(
        bundleId:BundleId,
        bundleDescription:BundleDescription,
        bundleName:BundleName,
        bundleStock:BundleStock,
        bundleImages:BundleImage[],
        bundlePrice:BundlePrice,
        bundleWeigth:BundleWeigth,
        productId:ProductID[],
        bundleCaducityDate?:BundleCaducityDate
    ):Bundle{
        const bundle = new Bundle(
            bundleId,
            bundleDescription,
            bundleName,
            bundleStock,
            bundleImages,
            bundlePrice,
            bundleWeigth,
            productId,
            bundleCaducityDate
            ? bundleCaducityDate
            : null
        )
        bundle.validateState()
        return bundle
    }
    get BundleDescription():BundleDescription{return this.bundleDescription}
    get BundleCaducityDate():BundleCaducityDate{return this.bundleCaducityDate}
    get BundleName():BundleName{return this.bundleName}
    get BundleStock():BundleStock{return this.bundleStock}
    get BundleImages():BundleImage[]{return this.bundleImages}
    get BundlePrice():BundlePrice{return this.bundlePrice}
    get BundleWeigth():BundleWeigth{return this.bundleWeigth}
    get ProductId():ProductID[]{return this.productsId}
}