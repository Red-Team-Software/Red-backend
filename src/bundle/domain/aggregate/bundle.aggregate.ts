import { AggregateRoot, DomainEvent} from "src/common/domain";
import { BundleRegistered } from "../domain-events/bundle-registered";
import { BundleId } from "../value-object/bundle-id";
import { BundleDescription } from "../value-object/bundle-description";
import { BundleCaducityDate } from '../value-object/bundle-caducity-date';
import { BundleName } from "../value-object/bundle-name";
import { BundleStock } from "../value-object/bundle-stock";
import { BundleImage } from "../value-object/bundle-image";
import { BundlePrice } from "../value-object/bundle-price";
import { BundleWeigth } from "../value-object/bundle-weigth";
import { ProductID } from "src/product/domain/value-object/product-id";
import { InvalidBundleException } from "../domain-exceptions/invalid-bundle-exception";
import { InvalidBundleProductsIdException } from "../domain-exceptions/invalid-bundle-products-id-exception";
import { BundleUpdatedName } from "../domain-events/bundle-updated-name";
import { BundleUpdatedDescription } from "../domain-events/bundle-updated-description";
import { BundleUpdatedStock } from "../domain-events/bundle-updated-stock";
import { BundleUpdatedImages } from "../domain-events/bundle-updated-images";
import { BundleUpdatedPrice } from "../domain-events/bundle-updated-price";
import { BundleUpdatedWeigth } from "../domain-events/bundle-updated-weigth";
import { BundleUpdatedProducts } from "../domain-events/bundle-updated-products";
import { BundleUpdatedCaducityDate } from "../domain-events/bundle-updated-caducity-date";
import { InvalidBundleProductsException } from "../domain-exceptions/invalid-bundle-products-exception";

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
                break;
            case 'BundleUpdatedName':
                const bundleUpdatedName: BundleUpdatedName = event as BundleUpdatedName
                this.bundleName = bundleUpdatedName.bundleName
                break;
            case 'BundleUpdatedDescription':
                const bundleUpdatedDescription:BundleUpdatedDescription = event as BundleUpdatedDescription
                this.bundleDescription= bundleUpdatedDescription.bundleDescription
                break;
            case 'BundleUpdatedStock':
                const bundleUpdatedStock:BundleUpdatedStock = event as BundleUpdatedStock
                this.bundleStock= bundleUpdatedStock.bundleStock
                break;
            case 'BundleUpdatedPrice':
                const bundleUpdatedPrice:BundleUpdatedPrice = event as BundleUpdatedPrice
                this.bundlePrice= bundleUpdatedPrice.bundlePrice
                break;
            case 'BundleUpdatedWeigth':
                const bundleUpdatedWeigth:BundleUpdatedWeigth = event as BundleUpdatedWeigth
                this.bundleWeigth= bundleUpdatedWeigth.bundleWeigth
                break;
            case 'BundleUpdatedCaducityDate':
                const bundleUpdatedCaducityDate:BundleUpdatedCaducityDate = event as BundleUpdatedCaducityDate
                this.bundleCaducityDate= bundleUpdatedCaducityDate.bundleCaducityDate
                break;
            case 'BundleUpdatedImages':
                const bundleUpdatedImages:BundleUpdatedImages = event as BundleUpdatedImages
                this.bundleImages= bundleUpdatedImages.bundleImages
                break;             
            case 'BundleUpdatedProducts':
                const bundleUpdatedProducts:BundleUpdatedProducts = event as BundleUpdatedProducts
                this.productsId= bundleUpdatedProducts.productId
                break;
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
        ! this.productsId)
        throw new InvalidBundleException()

        if (this.productsId.length<2)
            throw new InvalidBundleProductsException()

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

    updateName(bundleName:BundleName){
        this.apply(
            BundleUpdatedName.create(
                this.getId(),
                bundleName
            )
        )
    }

    updateDescription(bundleDescription:BundleDescription){
        this.apply(
            BundleUpdatedDescription.create(
                this.getId(),
                bundleDescription
            )
        )
    }

    updateStock(bunldeStock:BundleStock){
        this.apply(
            BundleUpdatedStock.create(
                this.getId(),
                bunldeStock
            )
        )
    }

    updateImages(bundleImages:BundleImage[]){
        this.apply(
            BundleUpdatedImages.create(
                this.getId(),
                bundleImages
            )
        )
    }

    updatePrice(bundlePrice:BundlePrice){
        this.apply(
            BundleUpdatedPrice.create(
                this.getId(),
                bundlePrice
            )
        )
    }

    updateWeigth(bundleWeigth:BundleWeigth){
        this.apply(
            BundleUpdatedWeigth.create(
                this.getId(),
                bundleWeigth
            )
        )
    }

    updateProducts(products:ProductID[]){
        this.apply(
            BundleUpdatedProducts.create(
                this.getId(),
                products
            )
        )
    }

    updateCaducityDate(bundleCaducityDate:BundleCaducityDate){
        this.apply(
            BundleUpdatedCaducityDate.create(
                this.getId(),
                bundleCaducityDate
            )
        )
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