import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IUserExternalAccount } from "src/auth/application/interfaces/user-external-account-interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ErrorSaveCardApplicationException } from "src/user/application/application-exeption/error-save-card-application-exception";
import { DeleteCardApplicationRequestDTO } from "src/user/application/dto/request/wallet/delete-card-application-request-dto";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";

export class DeleteCardToUserApplicationService extends IApplicationService<DeleteCardApplicationRequestDTO, boolean> {
    
    constructor(
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly userExternalSite: IUserExternalAccount
    ) {
        super();
    }

    async execute(data: DeleteCardApplicationRequestDTO): Promise<Result<boolean>> {
        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(data.userId));

        let cardResponse = await this.userExternalSite.deleteUserCards(
            data.cardId
        );

        if ( !cardResponse.isSuccess() ) 
            return Result.fail(new ErrorSaveCardApplicationException());

        return Result.success(true);
    }
}