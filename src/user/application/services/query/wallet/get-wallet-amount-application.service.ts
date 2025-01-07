import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { WalletAmountApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-wallet-amount-application-request-dto";
import { WalletAmountApplicationResponseDTO } from "src/user/application/dto/response/wallet/get-wallet-amount-application-response-dto";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";

export class GetWalletAmountApplicationService extends IApplicationService<WalletAmountApplicationRequestDTO, WalletAmountApplicationResponseDTO> {
    
    constructor(
        private readonly queryUserRepository:IQueryUserRepository,
    ) {
        super();
    }

    async execute(data: WalletAmountApplicationRequestDTO): Promise<Result<WalletAmountApplicationResponseDTO>> {
        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException())
        
        const user = userResponse.getValue;

        let amount = parseFloat(Number(user.Wallet.Ballance.Amount).toFixed(2))

        return Result.success({ amount: amount, currency: user.Wallet.Ballance.Currency });
    }
}