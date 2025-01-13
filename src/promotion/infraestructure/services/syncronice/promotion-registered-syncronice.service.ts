import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmPromotionEntity, OdmPromotionSchema } from '../../entities/odm-entities/odm-promotion-entity';
import { PromotionRegisteredInfraestructureRequestDTO } from '../dto/request/promotion-registered-infraestructure-request-dto';

export class PromotionRegisteredSyncroniceService implements ISycnchronizeService<PromotionRegisteredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmPromotionEntity>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmPromotionEntity>('odmpromotions', OdmPromotionSchema)
    }
    
    async execute(event: PromotionRegisteredInfraestructureRequestDTO): Promise<Result<void>> {
        const promotion = new this.model({
            id: event.promotionId,
            name: event.promotionName.name,
            description: event.promotionDescription,
            state:event.promotionState.state,
            discount:event.promotionDiscount,
            products:event.products,
            bundles:event.bundles,
            category:[] 
        })
        await this.model.create(promotion)
        return Result.success(undefined)
    }   
}