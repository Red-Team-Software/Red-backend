import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmCoupon, OdmCouponSchema } from '../../entities/odm-entities/odm-coupon-entity';
import { CouponStateUpdatedInfraestructureRequestDTO } from '../dto/coupon-state-updated-infraestructure-request-dto';

export class CouponStateUpdatedSyncroniceService implements ISycnchronizeService<CouponStateUpdatedInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmCoupon>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmCoupon>('OdmCoupon', OdmCouponSchema)
    }
    
    async execute(event: CouponStateUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let coupon = await this.model.findOne({id:event.cuponId})

        if (event.cuponState)
            coupon.state=event.cuponState

        await this.model.updateOne({id:event.cuponId},coupon)
        return Result.success(undefined)
    }   
}