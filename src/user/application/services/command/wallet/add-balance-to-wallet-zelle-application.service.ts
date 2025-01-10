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
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITransaction } from "src/user/application/model/transaction-interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { ErrorSaveTransactionApplicationException } from "src/user/application/application-exeption/error-save-transaction-application-exception";
import { PaymentMethodId } from '../../../../../payment-methods/domain/value-objects/payment-method-id';
import { NotFoundPaymentMethodApplicationException } from "src/payment-methods/application/application-exception/not-found-payment-method-application.exception";
import { PaymentMethodState } from "src/payment-methods/domain/value-objects/payment-method-state";
import { ErrorPaymentMethodInactiveApplicationException } from "src/payment-methods/application/application-exception/error-payment-method-inactive-application.exception";


export class AddBalanceToWalletZelleApplicationService extends IApplicationService<AddBalanceZelleApplicationRequestDTO, AddBalanceZelleApplicationResponseDTO> {
    
    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly TransactionCommandRepository: ICommandTransactionRepository<ITransaction>,
        private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository,
        private readonly idGen: IIdGen<string>,
    ) {
        super();
    }

    async execute(data: AddBalanceZelleApplicationRequestDTO): Promise<Result<AddBalanceZelleApplicationResponseDTO>> {
        
        let paymentMethod = await this.paymentMethodQueryRepository.findMethodById(PaymentMethodId.create(data.paymentId));

        if (!paymentMethod.isSuccess())
            return Result.fail(new NotFoundPaymentMethodApplicationException());

        if ( !paymentMethod.getValue.state.equals(PaymentMethodState.create('active')) )
            return Result.fail(new ErrorPaymentMethodInactiveApplicationException());

        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
        
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException())
        
        const user = userResponse.getValue;

        let newBalance = Ballance.create(
            Number(data.amount) + Number(user.Wallet.Ballance.Amount), 
            user.Wallet.Ballance.Currency);

        user.addWalletBalance(newBalance);

        let userRes= await this.commandUserRepository.saveUser(user);

        if (!userRes.isSuccess())
            return Result.fail(new ErrorUpdatingBalanceWalletApplicationException());

        let trans: ITransaction = {
            id: await this.idGen.genId(),
            currency: user.Wallet.Ballance.Currency,
            price: data.amount,
            wallet_id: user.Wallet.getId().Value,
            payment_method_id: data.paymentId,
            date: data.date,
        }

        let transaction = await this.TransactionCommandRepository.saveTransaction(trans);

        if (!transaction.isSuccess())
            return Result.fail(new ErrorSaveTransactionApplicationException());

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({ success: true, message: `Amount ${data.amount} has been added to the Wallet` });
    }
}