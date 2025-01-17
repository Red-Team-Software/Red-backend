import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmAccount, OdmAccountSchema } from '../../account/odm-entities/odm-account-entity';
import { AccountLogInInfraestructureRequestDTO } from '../dto/request/account-log-in-infraestructure-request-dto';

export class AccountLogInSyncroniceService implements 
ISycnchronizeService<AccountLogInInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmAccount>


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmAccount>('odmaccount', OdmAccountSchema)
    }
    
    async execute(event: AccountLogInInfraestructureRequestDTO): Promise<Result<void>> {

        const account = await this.model.findOne({id:event.id})
        account.sessions.push(event.session)
        await account.save()
        return Result.success(undefined)
    }   
}