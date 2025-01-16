import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { CouponDeletedInfraestructureRequestDTO } from '../dto/coupon-deleted-infraestructure-request-dto';
import { OdmCoupon, OdmCouponSchema } from '../../entities/odm-entities/odm-coupon-entity';

export class CouponDeletedSyncroniceService 
implements ISycnchronizeService<CouponDeletedInfraestructureRequestDTO,void>{
    
    private readonly model: Model<OdmCoupon>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmCoupon>('OdmCoupon', OdmCouponSchema)
    }
    async execute(event: CouponDeletedInfraestructureRequestDTO): Promise<Result<void>> {
        await this.model.deleteOne({id:event.cuponId})
        return Result.success(undefined)
    }   
}