import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserImage } from "src/user/domain/value-object/user-image";
import { UserName } from "src/user/domain/value-object/user-name";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { UpdateProfileApplicationRequestDTO } from "../../dto/request/update-profile-application-request-dto";
import { UpdateProfileApplicationResponseDTO } from "../../dto/response/update-profile-application-response-dto";
import { IQueryUserRepository } from "../../repository/user.query.repository.interface";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { ErrorUpdatinngUserApplicationException } from "../../application-exeption/error-updating-user-application-exception";
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { UserAlreadyExistPhoneNumberApplicationException } from "../../application-exeption/user-already-exist-phone-number-application-exception";
import { ICommandAccountRepository } from "src/auth/application/repository/command-account-repository.interface";
import { IAccount } from "src/auth/application/model/account.interface";
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { ErrorUpdatinngUserAccountApplicationException } from "../../application-exeption/error-updating-user-account-application-exception";
import { UserAlreadyExistApplicationException } from "../../application-exeption/user-already-exist-application-exception";


export class UpdateProfileApplicationService extends IApplicationService 
<UpdateProfileApplicationRequestDTO,UpdateProfileApplicationResponseDTO> {
    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly commandAccountRepository:ICommandAccountRepository<IAccount>,
        private readonly queryAccountRepository:IQueryAccountRepository<IAccount>,
        private readonly eventPublisher: IEventPublisher,
        private readonly fileUploader:IFileUploader,
        private readonly idGen:IIdGen<string>,
        private readonly encryptor:IEncryptor
    ){
        super()
    }
    
    async execute(data: UpdateProfileApplicationRequestDTO): Promise<Result<UpdateProfileApplicationResponseDTO>> {

        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId))

        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(data.userId))

        const user=userResponse.getValue
        
        if (data.name)
            user.updateName(UserName.create(data.name));
        if (data.phone){
            const userPhoneResponse=await this.queryUserRepository.verifyUserExistenceByPhoneNumber(
                UserPhone.create(data.phone)
            )

            if (!userPhoneResponse.isSuccess())
                return Result.fail(new ErrorUpdatinngUserApplicationException(data.userId))

            if(userPhoneResponse.getValue)
                return Result.fail(new UserAlreadyExistPhoneNumberApplicationException(data.phone))

            user.updatePhone(UserPhone.create(data.phone));
        }
        if (data.image){
            const image=await this.fileUploader.uploadFile(data.image,TypeFile.image,await this.idGen.genId())
            user.updateImage(UserImage.create(image.getValue.url));
        }

        let commandResponse=await this.commandUserRepository.updateUser(user)

        if (!commandResponse.isSuccess())
            return Result.fail(new ErrorUpdatinngUserApplicationException(data.userId))

        this.eventPublisher.publish(user.pullDomainEvents())

        let accountResponse=await this.queryAccountRepository.findAccountById(data.accountId)

        if (!accountResponse.isSuccess())
            return Result.fail(new ErrorUpdatinngUserApplicationException(data.userId))

        const account=accountResponse.getValue

        if(data.email){
            const queryResult= await this.queryAccountRepository.verifyAccountExistanceByEmail(data.email)
        
            if(!queryResult.isSuccess())
                return Result.fail(new ErrorUpdatinngUserAccountApplicationException(data.userId))
            
            if(queryResult.getValue)
                return Result.fail(new UserAlreadyExistApplicationException(data.email))            
            account.email=data.email
        }
        if(data.password)
            account.password=await this.encryptor.hashPassword(data.password)

        if(data.email||data.password){
            let accountUpdated=await this.commandAccountRepository.updateAccount(account)
            if (!accountUpdated.isSuccess())
                return Result.fail(new ErrorUpdatinngUserAccountApplicationException(data.userId))
        }

        return Result.success({userId:user.getId().Value})
    }

}
