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
            await this.model.updateOne({ id: bundle.id }, {$set: {caducityDate: event.bundleCaducityDate}});
        if (event.bundleDescription)
            await this.model.updateOne({ id: bundle.id }, {$set: {description: event.bundleDescription}});
        if (event.bundleImages)
            await this.model.updateOne({ id: bundle.id }, {$set: {image: event.bundleImages}});
        if (event.bundleName)
            await this.model.updateOne({ id: bundle.id }, {$set: {name: event.bundleName}});
        if (event.bundlePrice)
            await this.model.updateOne({ id: bundle.id },
                {$set: {price: event.bundlePrice.price, currency: event.bundlePrice.currency}});
        if (event.bundleStock)
            await this.model.updateOne({ id: bundle.id }, {$set: {stock: event.bundleStock}});
        if (event.bundleWeigth){
            await this.model.updateOne({ id: bundle.id },
                {$set: {weigth: event.bundleWeigth.weigth, measurament: event.bundleWeigth.measure}});
        }
        
        if (event.bundleProductId){
            const odmProducts: OdmProduct[] = [];
            for (const productId of event.bundleProductId) {
                let odmProduct = await this.productmodel.findOne({ id: productId });
                if (odmProduct) {
                    odmProducts.push(odmProduct);
                }
            }
            await this.model.updateOne({ id: bundle.id }, {$set: {products: odmProducts}});
        }
        await this.model.updateOne({id:bundle.id},bundle)
        return Result.success(undefined)
    }   
}