import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { PromotionUpdatedInfraestructureRequestDTO } from '../dto/request/promotion-updated-infraestructure-request-dto';
import { Model, Mongoose } from 'mongoose';
import { OdmPromotionEntity, OdmPromotionSchema } from '../../entities/odm-entities/odm-promotion-entity';
import { OdmProduct, OdmProductSchema } from 'src/product/infraestructure/entities/odm-entities/odm-product-entity';
import { OdmBundle, OdmBundleSchema } from 'src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity';

export class PromotionUpdatedSyncroniceService 
implements ISycnchronizeService<PromotionUpdatedInfraestructureRequestDTO,void>{
    
    private readonly promotionModel: Model<OdmPromotionEntity>
    private readonly productModel: Model<OdmProduct>
    private readonly bundleModel: Model<OdmBundle>

    constructor( mongoose: Mongoose ) { 
        this.promotionModel = mongoose.model<OdmPromotionEntity>('odmpromotions', OdmPromotionSchema)
        this.productModel = mongoose.model<OdmProduct>('odmproducts', OdmProductSchema)
        this.bundleModel = mongoose.model<OdmBundle>('odmbundles', OdmBundleSchema)

    }
    async execute(event: PromotionUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let promotion= await this.promotionModel.findOne({id:event.promotionId})

        if(!promotion)
            return Result.success(undefined)

        if (event.bundles){
            const odmBundles:OdmBundle[]=[]
            for (const bundle of event.bundles){
                let b=await this.bundleModel.findOne({id:bundle})
                if(b)
                    odmBundles.push(b)
            }
            promotion.bundles=odmBundles.map(b=>({
                id:b.id,
                name:b.name
            }))
        }
        if (event.products){
            const odmProduct:OdmProduct[]=[]
            for (const product of event.products){
                let b=await this.productModel.findOne({id:product})
                if(b)
                    odmProduct.push(b)
            }
            promotion.products=odmProduct.map(b=>({
                id:b.id,
                name:b.name
            }))        
        }
        if (event.promotionDescription)
            promotion.description=event.promotionDescription
        if (event.promotionDiscount)
            promotion.discount=event.promotionDiscount
        if (event.promotionName)
            promotion.name=event.promotionName
        if (event.promotionState)
            promotion.state=event.promotionState
        await this.promotionModel.updateOne({id:promotion.id},promotion)

        return Result.success(undefined)
    }   
}