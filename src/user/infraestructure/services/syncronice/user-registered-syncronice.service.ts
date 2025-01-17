import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmUserEntity, OdmUserSchema } from '../../entities/odm-entities/odm-user-entity';
import { UserRegistredInfraestructureRequestDTO } from '../dto/request/user-registered-infraestructure-request-dto';
import { UserRoles } from 'src/user/domain/value-object/enum/user.roles';

export class UserRegisteredSyncroniceService 
implements ISycnchronizeService<UserRegistredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmUserEntity>


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmUserEntity>('odmuser', OdmUserSchema)
    }
    
    async execute(event: UserRegistredInfraestructureRequestDTO): Promise<Result<void>> {

        const user = new this.model({
            id:event.userId,
            name:event.userName,
            phone:event.userPhone,
            image:event.userImage,
            type:event.userRole as UserRoles,
            direction:[],
            wallet:{
                id:event.wallet.walletId,
                currency:event.wallet.ballance.currency,
                amount: event.wallet.ballance.amount
            },
            coupon:[]
        })
        await this.model.create(user)
        return Result.success(undefined)
    }   
}