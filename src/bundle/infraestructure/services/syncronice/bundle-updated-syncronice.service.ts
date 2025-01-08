import { Model, Mongoose } from "mongoose"
import { ISycnchronizeService } from "src/common/infraestructure/synchronize-service/synchronize.service.interface"
import { Result } from "src/common/utils/result-handler/result"
import { OdmBundle, OdmBundleSchema } from "../../entities/odm-entities/odm-bundle-entity"
import { BundleUpdatedInfraestructureRequestDTO } from "../dto/request/bundle-updated-infraestructure-request-dto"
import { OdmProduct, OdmProductSchema } from "src/product/infraestructure/entities/odm-entities/odm-product-entity"

export class BundleUpdatedSyncroniceService 
implements ISycnchronizeService<BundleUpdatedInfraestructureRequestDTO,void>{
    
    private readonly model: Model<OdmBundle>
    private readonly productmodel: Model<OdmProduct>


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema)
        this.productmodel = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
    }
    async execute(event: BundleUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let bundle= await this.model.findOne({id:event.bundleId})
        if (event.bundleCaducityDate)
            bundle.caducityDate=event.bundleCaducityDate
        if (event.bundleDescription)
            bundle.description=event.bundleDescription
        if (event.bundleImages)
            bundle.image=event.bundleImages
        if (event.bundleName)
            bundle.name=event.bundleName
        if (event.bundlePrice){
            bundle.price=event.bundlePrice.price
            bundle.currency=event.bundlePrice.currency
        }
        if (event.bundleStock)
            bundle.stock=event.bundleStock
        if (event.bundleWeigth){
            bundle.weigth=event.bundleWeigth.weigth
            bundle.measurament=event.bundleWeigth.measure
        }
        if (event.bundleProductId){
            const odmProducts: OdmProduct[] = [];
            for (const productId of event.bundleProductId) {
              let odmProduct = await this.productmodel.findOne({ id: productId });
              if (odmProduct) {
                odmProducts.push(odmProduct);
              }
            }
            bundle.products = odmProducts;
        }
        await this.model.updateOne({id:bundle.id},bundle)
        return Result.success(undefined)
    }   
}