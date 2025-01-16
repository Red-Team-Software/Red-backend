import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmAccount, OdmAccountSchema } from '../../account/odm-entities/odm-account-entity';
import { AccountRegistredInfraestructureRequestDTO } from '../dto/request/account-registered-infraestructure-request-dto';

export class AccountRegisteredSyncroniceService implements ISycnchronizeService<AccountRegistredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmAccount>


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmAccount>('odmaccount', OdmAccountSchema)
    }
    
    async execute(event: AccountRegistredInfraestructureRequestDTO): Promise<Result<void>> {

        const account = new this.model({
            sessions: event.sessions
            ? event.sessions.map(s=>({
                id: s.id,
                expired_at: s.expired_at,
                push_token: s.push_token,
                accountId:s.accountId
            }))
            : [],
            id: event.id,
            email: event.email,
            password: event.password,
            created_at: event.created_at,
            isConfirmed:event.isConfirmed,
            code: event.code,
            code_created_at:event.code_created_at,
            idUser:event.idUser,
            idStripe:event.idStripe
        })
        await this.model.create(account)
        return Result.success(undefined)
    }   
}