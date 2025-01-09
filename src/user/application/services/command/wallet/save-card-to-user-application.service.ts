import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IUserExternalAccountService } from "src/auth/application/interfaces/user-external-account-interface";
import { IAccount } from "src/auth/application/model/account.interface";
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ErrorSaveCardApplicationException } from "src/user/application/application-exeption/error-save-card-application-exception";
import { SaveCardApplicationRequestDTO } from "src/user/application/dto/request/wallet/save-card-application-request-dto";
import { SaveCardApplicationResponseDTO } from "src/user/application/dto/response/wallet/save-card-application-response-dto";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";

export class SaveCardToUserApplicationService extends IApplicationService<SaveCardApplicationRequestDTO, SaveCardApplicationResponseDTO> {
    
    constructor(
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly accountRepository:IQueryAccountRepository<IAccount>,
        private readonly userExternalSite: IUserExternalAccountService
    ) {
        super();
    }

    async execute(data: SaveCardApplicationRequestDTO): Promise<Result<SaveCardApplicationResponseDTO>> {
        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException());
        
        const user = userResponse.getValue;

        let userAccount = await this.accountRepository.findAccountById(user.getId().Value);

        if ( !userAccount.isSuccess() ) 
            return Result.fail(new UserNotFoundApplicationException());

        let cardResponse = await this.userExternalSite.saveCardtoUser(
            userAccount.getValue.idStripe,
            data.cardId
        );

        if ( !cardResponse.isSuccess() ) 
            return Result.fail(new ErrorSaveCardApplicationException());

        return Result.success({ success: true, message: `The card has been added` });
    }
}