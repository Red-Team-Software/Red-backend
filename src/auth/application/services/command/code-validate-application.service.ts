import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { CodeValidateApplicationRequestDTO } from "../../dto/request/code-validate-application-request-dto";
import { CodeValidateApplicationResponseDTO } from "../../dto/response/code-validate-application-response-dto";
import { ICodeGenerator } from "src/common/application/code-generator-interface/code-generator.interface";
import { IDateHandler } from "src/common/application/date-handler/date-handler.interface";
import { EmailSenderSendCodeRequestDTO } from "src/common/application/email-sender/dto/request/email-sender-send-code-dto";
import { IEmailSender } from "src/common/application/email-sender/email-sender.interface";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { ErrorRegisteringUserCodeApplicationException } from "../../application-exception/error-registering-user-code-application-exception";
import { UserNotFoundApplicationException } from "../../application-exception/user-not-found-application-exception";
import { IAccount } from "../../model/account.interface";
import { ICommandAccountRepository } from "../../repository/command-account-repository.interface";
import { IQueryAccountRepository } from "../../repository/query-account-repository.interface";
import { InvalidCodeApplicationException } from "../../application-exception/invalid-code-application-exception";
import { CodeExpiredApplicationException } from "../../application-exception/code-expired-application-exception";


export class CodeValidateApplicationService extends IApplicationService 
<CodeValidateApplicationRequestDTO,CodeValidateApplicationResponseDTO> {
    constructor(
        private readonly queryAccountRepository:IQueryAccountRepository<IAccount>,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly encryptor: IEncryptor,
        private readonly dateHandler:IDateHandler
    ){
        super()
    }

    async execute(data: CodeValidateApplicationRequestDTO): Promise<Result<CodeValidateApplicationResponseDTO>> {
        
        const result = await this.queryAccountRepository.findAccountByEmail( data.email )

        if ( !result.isSuccess() ) 
            return Result.fail(new UserNotFoundApplicationException())

        const account=result.getValue 

        const resultuser= await this.queryUserRepository.findUserById(UserId.create(account.id))

        if ( !resultuser.isSuccess() ) 
            return Result.fail(new UserNotFoundApplicationException())

        const user=resultuser.getValue 

        if (!account.code || !await this.encryptor.comparePlaneAndHash(data.code,account.code))
            return Result.fail(new InvalidCodeApplicationException());
        
        if (!account.code_created_at || account.code_created_at < this.dateHandler.currentDate())
            return Result.fail(new CodeExpiredApplicationException());

        return Result.success({code:data.code , validate:true})
        
    }
    
}