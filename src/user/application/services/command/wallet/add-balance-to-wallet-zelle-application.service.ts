import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { ErrorUpdatingBalanceWalletApplicationException } from "src/user/application/application-exeption/error-updating-wallet-balance-application-exception";
import { Wallet } from "src/user/domain/entities/wallet/wallet.entity";
import { AddBalanceZelleApplicationRequestDTO } from "src/user/application/dto/request/wallet/add-balance-to-wallet-zelle-application-resquest-dto";
import { AddBalanceZelleApplicationResponseDTO } from "src/user/application/dto/response/wallet/add-balance-to-wallet-pago-movil-direction-application-response-dto";
import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";


export class AddBalanceToWalletZelleApplicationService extends IApplicationService<AddBalanceZelleApplicationRequestDTO, AddBalanceZelleApplicationResponseDTO> {
    
    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher
    ) {
        super();
    }

    async execute(data: AddBalanceZelleApplicationRequestDTO): Promise<Result<AddBalanceZelleApplicationResponseDTO>> {
        
        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException())
        
        const user = userResponse.getValue;

        let newBalance = Ballance.create(data.amount, user.Wallet.Ballance.Currency);

        let newWallet = Wallet.create(user.Wallet.getId(), newBalance);

        user.addWalletBalance(newWallet);

        let userRes= await this.commandUserRepository.saveUser(user);

        if (!userRes.isSuccess())
            return Result.fail(new ErrorUpdatingBalanceWalletApplicationException());

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({ success: true, message: `Amount ${newBalance.Amount} has been added to the Wallet` });
    }
}