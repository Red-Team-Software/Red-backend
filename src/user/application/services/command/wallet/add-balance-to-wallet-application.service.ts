import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { AddBalancePagoMovilApplicationRequestDTO } from "src/user/application/dto/request/wallet/add-balance-to-wallet-pago-movil-application-resquest-dto"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { ErrorUpdatingBalanceWalletApplicationException } from "src/user/application/application-exeption/error-updating-wallet-balance-application-exception";
import { AddBalanceZelleApplicationResponseDTO } from "src/user/application/dto/response/wallet/add-balance-to-wallet-pago-movil-direction-application-response-dto";
import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITransaction } from "src/user/application/model/transaction-interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { ErrorSaveTransactionApplicationException } from "src/user/application/application-exeption/error-save-transaction-application-exception";
import { CalculateBallanceService } from "src/user/domain/domain-services/services/calculate-ballance.service";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { NotFoundPaymentMethodApplicationException } from "src/user/application/application-exeption/not-found-payment-method-application.exception";


export class AddBalanceToWalletApplicationService extends IApplicationService<AddBalancePagoMovilApplicationRequestDTO, AddBalanceZelleApplicationResponseDTO> {
    
    constructor(
        private readonly paymentQueryRepository:IPaymentMethodQueryRepository,
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly calculateBallanceService:CalculateBallanceService,
        private TransactionCommandRepository: ICommandTransactionRepository<ITransaction>,
        private readonly idGen: IIdGen<string>,
    ) {
        super();
    }
    

    async execute(data: AddBalancePagoMovilApplicationRequestDTO): Promise<Result<AddBalanceZelleApplicationResponseDTO>> {
        
        let paymentMethod = await this.paymentQueryRepository.findMethodById(PaymentMethodId.create(data.paymentId));
        
        if (!paymentMethod.isSuccess())
            return Result.fail(new NotFoundPaymentMethodApplicationException(data.paymentId));
        
        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(data.userId))

        let paymentMethodResponse=await this.paymentQueryRepository.findMethodById(
            PaymentMethodId.create(data.paymentId)
        )

        if (!paymentMethodResponse.isSuccess())
            return Result.fail(new NotFoundPaymentMethodApplicationException(data.paymentId))
        
        const user = userResponse.getValue;

        const newBalance=await this.calculateBallanceService.calculate(
            Ballance.create(data.amount,data.currency)
        )

        user.addWalletBalance(newBalance);

        let userRes= await this.commandUserRepository.updateUser(user);

        if (!userRes.isSuccess())
            return Result.fail(new ErrorUpdatingBalanceWalletApplicationException());

        let trans: ITransaction = {
            id: await this.idGen.genId(),
            currency: user.Wallet.Ballance.Currency,
            price: newBalance.Amount,
            wallet_id: user.Wallet.getId().Value,
            payment_method_id: data.paymentId,
            date: data.date,
        }
        
        let transaction = await this.TransactionCommandRepository.saveTransaction(trans);
        
        if (!transaction.isSuccess())
            return Result.fail(new ErrorSaveTransactionApplicationException());

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({ success: true, message: `Amount ${newBalance.Amount} has been added to the Wallet` });
    }
}