import { IApplicationService } from "src/common/application/services";
import { ChangePasswordApplicationRequestDTO } from "../../dto/request/change-password-application-request-dto";
import { ChangePasswordApplicationResponseDTO } from "../../dto/response/change-password-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";
import { ICodeGenerator } from "src/common/application/code-generator-interface/code-generator.interface";
import { IDateHandler } from "src/common/application/date-handler/date-handler.interface";
import { EmailSenderSendCodeRequestDTO } from "src/common/application/email-sender/dto/request/email-sender-send-code-dto";
import { IEmailSender } from "src/common/application/email-sender/email-sender.interface";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { IAccount } from "../../model/account.interface";
import { ICommandAccountRepository } from "../../repository/command-account-repository.interface";
import { IQueryAccountRepository } from "../../repository/query-account-repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserNotFoundApplicationException } from "../../application-exeption/user-not-found-application-exception";
import { CodeExpiredApplicationException } from "../../application-exeption/code-expired-application-exception";
import { InvalidCodeApplicationException } from "../../application-exeption/invalid-code-application-exception";
import { ErrorUpdatingUserPasswordApplicationException } from "../../application-exeption/error-updating-user-password-application-exception";

export class ChangePasswordApplicationService extends IApplicationService 
<ChangePasswordApplicationRequestDTO,ChangePasswordApplicationResponseDTO> {

    constructor(
        private readonly queryAccountRepository:IQueryAccountRepository<IAccount>,
        private readonly commandAccountRepository:ICommandAccountRepository<IAccount>,
        private readonly encryptor: IEncryptor,
        private readonly dateHandler:IDateHandler,
    ){
        super()
    }

    async execute(data: ChangePasswordApplicationRequestDTO): Promise<Result<ChangePasswordApplicationResponseDTO>> {
                
        const result = await this.queryAccountRepository.findAccountByEmail( data.email )

        if ( !result.isSuccess() ) 
            return Result.fail(new UserNotFoundApplicationException())

        const account=result.getValue 

        if (!account.code || !this.encryptor.comparePlaneAndHash(data.code,account.code))
            return Result.fail(new InvalidCodeApplicationException());
        
        if (!account.code_created_at || account.code_created_at < this.dateHandler.currentDate())
            return Result.fail(new CodeExpiredApplicationException());

        let newPassword= await this.encryptor.hashPassword(data.password)

        console.log(account.password)
        
        account.password=newPassword
        account.code=null
        account.code_created_at=null

        console.log(account.password)

        let accountResult=await this.commandAccountRepository.updateAccount(account)

        if (!accountResult.isSuccess())
            return Result.fail(new ErrorUpdatingUserPasswordApplicationException() )

        return Result.success(null)
    }
    
}