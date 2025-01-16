import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmUserEntity, OdmUserSchema } from '../../entities/odm-entities/odm-user-entity';
import { UserUpdatedInfraestructureRequestDTO } from '../dto/request/user-updated-infraestructure-request-dto';

export class UserUpdatedSyncroniceService 
implements ISycnchronizeService<UserUpdatedInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmUserEntity>


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmUserEntity>('odmuser', OdmUserSchema)
    }
    
    async execute(event: UserUpdatedInfraestructureRequestDTO): Promise<Result<void>> {

        let user= await this.model.findOne({id:event.userId})

        if(event.userImage)
            await this.model.updateOne({ id: event.userId }, {$set: {image: event.userImage}})

        if(event.userName)
            await this.model.updateOne({ id: event.userId }, {$set: {name: event.userName}})

        if(event.userPhone)
            await this.model.updateOne({ id: event.userId }, {$set: {phone: event.userPhone}})

        if(event.wallet)
            await this.model.updateOne({ id: event.userId }, {$set: {wallet: {
                id:event.wallet.walletId,
                currency:event.wallet.ballance.currency,
                amount:event.wallet.ballance.amount  
            }}})

            if (event.coupons) {
                for (const newCoupon of event.coupons) {
                    let coupon = user.coupon.find(c => c.id === newCoupon.id);
                    if (!coupon) {
                        user.coupon.push(newCoupon)
                    } else {
                        user.coupon = user.coupon.filter(c => c.id !== newCoupon.id)
                        user.coupon.unshift(newCoupon)
                    }
                }
                await user.save()
            }
            

        return Result.success(undefined)
    }   
}