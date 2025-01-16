import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { CouponCreatedInfraestructureRequestDTO } from '../dto/coupon-created-infraestructure-request-dto';
import { OdmCoupon, OdmCouponSchema } from '../../entities/odm-entities/odm-coupon-entity';

export class CouponRegisteredSyncroniceService implements ISycnchronizeService<CouponCreatedInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmCoupon>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmCoupon>('OdmCoupon', OdmCouponSchema )
    }
    
    async execute(event: CouponCreatedInfraestructureRequestDTO): Promise<Result<void>> {
        const coupon = new this.model({
            id: event.cuponId,
            name: event.cuponName,
            code: event.cuponCode,
            discount: event.cuponDiscount,
            state: event.cuponState
        })
        await this.model.create(coupon)
        return Result.success(undefined)
    }   
}