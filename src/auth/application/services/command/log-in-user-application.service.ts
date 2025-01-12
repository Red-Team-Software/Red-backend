import { IAccount } from "../../model/account.interface";
import { IApplicationService } from "src/common/application/services";
import { ICommandTokenSessionRepository } from "../../repository/command-token-session-repository.interface";
import { IDateHandler } from "src/common/application/date-handler/date-handler.interface";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";
import { InvalidPasswordApplicationException } from "../../application-exception/invalid-password-application-exception";
import { IQueryAccountRepository } from "../../repository/query-account-repository.interface";
import { ISession } from "../../model/session.interface";
import { LogInUserApplicationRequestDTO } from "../../dto/request/log-in-user-application-request-dto";
import { LogInUserApplicationResponseDTO } from "../../dto/response/log-in-user-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";
import { UserNotFoundApplicationException } from "../../application-exception/user-not-found-application-exception";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";
import { ErrorRegisteringSessionApplicationException } from "../../application-exception/error-registering-session-application-exception";
import { AccountNotFoundApplicationException } from "../../application-exception/account-not-found-application-exception";

export class LogInUserApplicationService extends IApplicationService 
<LogInUserApplicationRequestDTO,LogInUserApplicationResponseDTO> {

    constructor(
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly queryAccountRepository:IQueryAccountRepository<IAccount>,
        private readonly commandTokenSessionRepository:ICommandTokenSessionRepository<ISession>,
        private readonly encryptor: IEncryptor,
        private readonly idGen:IIdGen<string>,
        private readonly jwtGen:IJwtGenerator<string>,
        private readonly dateHandler:IDateHandler
    ){
        super()
    }

    async execute(data: LogInUserApplicationRequestDTO): Promise<Result<LogInUserApplicationResponseDTO>> {

        let resultaccount=await this.queryAccountRepository.findAccountByEmail(data.email)

        if (!resultaccount.isSuccess())
            return Result.fail(new AccountNotFoundApplicationException(data.email))

        const account = resultaccount.getValue

        let resultUser=await this.queryUserRepository.findUserById(UserId.create(account.idUser))

        if (!resultUser.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(account.idUser))

        const user= resultUser.getValue

        //TODO para nosotros exclusivamente
        // if(!account.isConfirmed) 
        //     return Result.fail(new UserNotVerifiedApplicationException())

        const validPassword = await this.encryptor.comparePlaneAndHash( data.password, account.password )
        
        if ( !validPassword ) 
            return Result.fail(new InvalidPasswordApplicationException())

        const idSession = await this.idGen.genId() 

        const jwt = this.jwtGen.generateJwt( idSession )
        
        let sessionResponse=await this.commandTokenSessionRepository.createSession(
        {
            expired_at: this.dateHandler.getExpiry(),
            id: idSession,
            push_token: null,
            accountId: account.id
        })

        if (!sessionResponse.isSuccess())
            return Result.fail(new ErrorRegisteringSessionApplicationException())

        return Result.success({
            accountId:account.id,
            user: {
                id: user.getId().Value,
                email: account.email,
                name: user.UserName.Value,
                phone: user.UserPhone.Value
            },
            type: user.UserRole.Value,
            token: jwt
        })

    }

}