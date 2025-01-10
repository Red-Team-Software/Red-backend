import { IDateHandler } from './../../../../common/application/date-handler/date-handler.interface';
import { IApplicationService } from "src/common/application/services";
import { ForgetPasswordApplicationRequestDTO } from "../../dto/request/forget-password-application-request-dto";
import { ForgetPasswordApplicationResponseDTO } from "../../dto/response/forget-password-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryAccountRepository } from "../../repository/query-account-repository.interface";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";
import { IAccount } from "../../model/account.interface";
import { ICommandAccountRepository } from "../../repository/command-account-repository.interface";
import { UserNotFoundApplicationException } from "../../application-exception/user-not-found-application-exception";
import { ICodeGenerator } from "src/common/application/code-generator-interface/code-generator.interface";
import { ErrorRegisteringUserCodeApplicationException } from '../../application-exception/error-registering-user-code-application-exception';
import { EmailSenderSendCodeRequestDTO } from 'src/common/application/email-sender/dto/request/email-sender-send-code-dto';
import { IEmailSender } from 'src/common/application/email-sender/email-sender.interface';
import { IQueryUserRepository } from 'src/user/application/repository/user.query.repository.interface';
import { UserId } from 'src/user/domain/value-object/user-id';

export class ForgetPasswordApplicationService extends IApplicationService 
<ForgetPasswordApplicationRequestDTO,ForgetPasswordApplicationResponseDTO> {

    constructor(
        private readonly queryAccountRepository:IQueryAccountRepository<IAccount>,
        private readonly commandAccountRepository:ICommandAccountRepository<IAccount>,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly encryptor: IEncryptor,
        private readonly codeGenerator:ICodeGenerator<string>,
        private readonly dateHandler:IDateHandler,
        private readonly emailSender:IEmailSender<EmailSenderSendCodeRequestDTO,boolean>,
    ){
        super()
    }

    async execute(data: ForgetPasswordApplicationRequestDTO): Promise<Result<ForgetPasswordApplicationResponseDTO>> {

        const result = await this.queryAccountRepository.findAccountByEmail( data.email )

        if ( !result.isSuccess() ) 
            return Result.fail(new UserNotFoundApplicationException())

        const account=result.getValue 

        const resultuser= await this.queryUserRepository.findUserById(UserId.create(account.id))

        if ( !resultuser.isSuccess() ) 
            return Result.fail(new UserNotFoundApplicationException())

        const user=resultuser.getValue 

        const code = this.codeGenerator.generateCode(4)

        account.code=await this.encryptor.hashPassword(code)
        account.code_created_at=this.dateHandler.getExpiry()

        const ormAccount=this.commandAccountRepository.updateAccount(account)

        if (!ormAccount)
            return Result.fail(new ErrorRegisteringUserCodeApplicationException())

        const answer = { 
            email: data.email,
            code: code,
            date: this.dateHandler.currentDate()
        }
        
        this.emailSender.setVariablesToSend({code,username:user.UserName.Value})
        
        await this.emailSender.sendEmail(data.email)
        
        return Result.success({date:answer.date})        
    }
    
}