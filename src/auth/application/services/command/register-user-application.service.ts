import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { RegisterUserApplicationRequestDTO } from "../../dto/request/register-user-application-request-dto";
import { RegisterUserApplicationResponseDTO } from "../../dto/response/register-user-application-response-dto";
import { ICommandAccountRepository } from "../../repository/command-account-repository.interface";
import { IAccount } from "../../model/account.interface";
import { IQueryAccountRepository } from "../../repository/query-account-repository.interface";
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UserAlreadyExistApplicationException } from "../../application-exeption/user-already-exist-application-exception";
import { IEncryptor } from 'src/common/application/encryptor/encryptor.interface';
import { IDateHandler } from "src/common/application/date-handler/date-handler.interface";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserEmail } from "src/user/domain/value-object/user-email";
import { UserName } from "src/user/domain/value-object/user-name";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ErrorRegisteringAccountApplicationException } from "../../application-exeption/error-registering-account-application-exception";
import { ErrorRegisteringUserApplicationException } from "../../application-exeption/error-registering-user-application-exception";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { UserRole } from "src/user/domain/value-object/user-role";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserAlreadyExistPhoneNumberApplicationException } from "../../application-exeption/user-already-exist-phone-number-application-exception";
import { Wallet } from "src/user/domain/entities/wallet/wallet.entity";
import { WalletId } from "src/user/domain/entities/wallet/value-objects/wallet-id";
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance";


export class RegisterUserApplicationService extends IApplicationService 
<RegisterUserApplicationRequestDTO,RegisterUserApplicationResponseDTO> {

    constructor(
        private readonly commandAccountRepository:ICommandAccountRepository<IAccount>,
        private readonly queryAccountRepository:IQueryAccountRepository<IAccount>,
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly idGen:IIdGen<string>,
        private readonly encryptor:IEncryptor,
        private readonly dateHandler:IDateHandler,
        private readonly eventPublisher:IEventPublisher,
    ){
        super()
    }

    async execute(data: RegisterUserApplicationRequestDTO): Promise<Result<RegisterUserApplicationResponseDTO>> {

        let queryResult= await this.queryAccountRepository.verifyAccountExistanceByEmail(data.email)
        
        if(!queryResult.isSuccess())
            return Result.fail(new ErrorRegisteringAccountApplicationException())
        
        if(queryResult.getValue)
            return Result.fail(new UserAlreadyExistApplicationException(data.email))

        let userResult= await this.queryUserRepository.verifyUserExistenceByPhoneNumber(
            UserPhone.create(data.phone)
        )

        if(!userResult.isSuccess())
            return Result.fail(new ErrorRegisteringAccountApplicationException())

        
        if(userResult.getValue)
            return Result.fail(new UserAlreadyExistPhoneNumberApplicationException(data.phone))


        let id= await this.idGen.genId()

        let password= await this.encryptor.hashPassword(data.password)

        let user=User.RegisterUser(
            UserId.create(await this.idGen.genId()),
            UserName.create(data.name),
            UserPhone.create(data.phone),
            UserRole.create(UserRoles.CLIENT),
            [],
            Wallet.create(
                WalletId.create(await this.idGen.genId()),
                Ballance.create(0,'usd')
            )
        )


        let account:IAccount={
            sessions: [] ,
            id:id,
            email: data.email,
            password: password,
            created_at: this.dateHandler.currentDate(),
            isConfirmed:false,
            idUser:user.getId().Value
        }

        let userResponse=await this.commandUserRepository.saveUser(user)

        if(!userResponse.isSuccess())
            return Result.fail(new ErrorRegisteringUserApplicationException())

        let commandResult=await this.commandAccountRepository.createAccount(account)

        console.log(commandResult)
        
        if (!commandResult.isSuccess())
            return Result.fail(new ErrorRegisteringAccountApplicationException())
        
        this.eventPublisher.publish(user.pullDomainEvents())
        
        return Result.success({id})
    }
    
}