import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmPromotionEntity, OdmPromotionSchema } from '../../entities/odm-entities/odm-promotion-entity';
import { PromotionRegisteredInfraestructureRequestDTO } from '../dto/request/promotion-registered-infraestructure-request-dto';
import { OdmProduct, OdmProductSchema } from 'src/product/infraestructure/entities/odm-entities/odm-product-entity';
import { OdmBundle, OdmBundleSchema } from 'src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity';

export class PromotionRegisteredSyncroniceService implements ISycnchronizeService<PromotionRegisteredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmPromotionEntity>
    private readonly productmodel: Model<OdmProduct>
    private readonly bundlemodel: Model<OdmBundle>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmPromotionEntity>('odmpromotions', OdmPromotionSchema)
        this.bundlemodel = mongoose.model<OdmBundle>('odmbundle', OdmBundleSchema)
        this.productmodel = mongoose.model<OdmProduct>('odmproduct', OdmProductSchema)
    }
    
    async execute(event: PromotionRegisteredInfraestructureRequestDTO): Promise<Result<void>> {

        let products:OdmProduct[]=[]
        let bundles:OdmBundle[]=[]

        for (const p of event.products){
            products.push(await this.productmodel.findOne({id:p}))
        }

        for (const b of event.bundles){
            bundles.push(await this.bundlemodel.findOne({id:b}))
        }

        const promotion = new this.model({
            id: event.promotionId,
            name: event.promotionName.name,
            description: event.promotionDescription,
            state:event.promotionState.state,
            discount:event.promotionDiscount,
            products:event.products
            ? products.map(p=>({
                id:p.id,
                name:p.name
            }))
            : [],
            bundles:event.bundles
            ? bundles.map(p=>({
                id:p.id,
                name:p.name
            }))
            : [],
            category:[] 
        })
        await this.model.create(promotion)
        return Result.success(undefined)
    }   
}