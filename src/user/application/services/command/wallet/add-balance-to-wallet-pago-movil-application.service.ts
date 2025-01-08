import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { IConversionService } from "src/order/domain/domain-services/interfaces/conversion-currency-interface";
import { ConvertAmount } from "src/order/domain/value_objects/vo-domain-services/convert-amount";
import { ErrorChangeCurrencyApplicationException } from "src/order/application/application-exception/error-change-currency-application-exception";
import { AddBalancePagoMovilApplicationRequestDTO } from "src/user/application/dto/request/wallet/add-balance-to-wallet-pago-movil-application-resquest-dto"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { ErrorUpdatingBalanceWalletApplicationException } from "src/user/application/application-exeption/error-updating-wallet-balance-application-exception";
import { Wallet } from "src/user/domain/entities/wallet/wallet.entity";
import { AddBalanceZelleApplicationResponseDTO } from "src/user/application/dto/response/wallet/add-balance-to-wallet-pago-movil-direction-application-response-dto";
import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITransaction } from "src/user/application/model/transaction-interface";


export class AddBalanceToWalletPagoMovilApplicationService extends IApplicationService<AddBalancePagoMovilApplicationRequestDTO, AddBalanceZelleApplicationResponseDTO> {
    
    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly exchangeRate: IConversionService,
        private TransactionCommandRepository: ICommandTransactionRepository<ITransaction>
    ) {
        super();
    }
    

    async execute(data: AddBalancePagoMovilApplicationRequestDTO): Promise<Result<AddBalanceZelleApplicationResponseDTO>> {
        
        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException())
        
        const user = userResponse.getValue;

        let change = ConvertAmount.create(data.amount, user.Wallet.Ballance.Currency);

        let newChange = await this.exchangeRate.convertAmountVEStoUSD(change);

        if (!newChange.isSuccess())
            return Result.fail(new ErrorChangeCurrencyApplicationException());

        let newBalance = Ballance.create(newChange.getValue.Amount, user.Wallet.Ballance.Currency);

        let newWallet = Wallet.create(user.Wallet.getId(), newBalance);

        user.addWalletBalance(newWallet);

        let userRes= await this.commandUserRepository.saveUser(user);

        if (!userRes.isSuccess())
            return Result.fail(new ErrorUpdatingBalanceWalletApplicationException());

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({ success: true, message: `Amount ${newBalance.Amount} has been added to the Wallet` });
    }
}