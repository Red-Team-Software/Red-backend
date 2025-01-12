import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IUserExternalAccount } from "src/auth/application/interfaces/user-external-account-interface";
import { IAccount } from "src/auth/application/model/account.interface";
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ErrorUserCardsNotFoundApplicationException } from "src/user/application/application-exeption/error-user-cards-not-found-application-exception";
import { UserCardsApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-user-cards-application-request-dto";
import { UserCardsApplicationResponseDTO } from "src/user/application/dto/response/wallet/get-user-cards-application-response-dto";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";

export class GetUserCardsApplicationService extends IApplicationService<UserCardsApplicationRequestDTO, UserCardsApplicationResponseDTO> {
    
    constructor(
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly accountRepository:IQueryAccountRepository<IAccount>,
        private readonly userExternalSite: IUserExternalAccount
    ) {
        super();
    }

    async execute(data: UserCardsApplicationRequestDTO): Promise<Result<UserCardsApplicationResponseDTO>> {
        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(data.userId));
        
        const user = userResponse.getValue;

        let userAccount = await this.accountRepository.findAccountById(user.getId().Value);

        if ( !userAccount.isSuccess() ) 
            return Result.fail(new UserNotFoundApplicationException(data.userId));

        let cards = await this.userExternalSite.getUserCards(userAccount.getValue.idStripe);

        if (!cards.isSuccess())
            return Result.fail(new ErrorUserCardsNotFoundApplicationException());

        return Result.success(cards.getValue);
    }
}