import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { NotFoundTransactionApplicationException } from "src/user/application/application-exeption/not-found-transaction-application.exception";
import { GetAllTransactionsApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-all-transactions-application-request-dto";
import { GetAllTransactionsApplicationResponseDTO } from "src/user/application/dto/response/wallet/get-all-transactions-application-response-dto";
import { ITransaction } from "src/user/application/model/transaction-interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { IQueryTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction-query-repository.interface";
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITypeTransaction } from "src/user/application/types/transaction-type";
import { UserId } from "src/user/domain/value-object/user-id";

export class FindAllTransactionsByUserApplicationService extends IApplicationService<GetAllTransactionsApplicationRequestDTO,GetAllTransactionsApplicationResponseDTO>{
    
    constructor(
        private transactionQueryRepository: IQueryTransactionRepository<ITransaction>,
        private userQueryRepository: IQueryUserRepository,
        private paymentMethodQueryRepository: IPaymentMethodQueryRepository
    ){
        super()
    }
    
    async execute(data: GetAllTransactionsApplicationRequestDTO): Promise<Result<GetAllTransactionsApplicationResponseDTO>> {

        data.page = data.page * data.perPage - data.perPage

        let user = await this.userQueryRepository.findUserById(UserId.create(data.userId));

        if (!user.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(data.userId));

        let walletId = user.getValue.Wallet.getId().Value;

        let response: ITypeTransaction[] = [];

        let transactions = await this.transactionQueryRepository.getAllTransactionsByWalletId(
            walletId,
            data.page, 
            data.perPage
        );

        if (!transactions.isSuccess())
            return Result.fail(new NotFoundTransactionApplicationException());

        let paymentMethods = await this.paymentMethodQueryRepository.findAllMethods({
            userId: data.userId,
            page: 0,
            perPage: 200,
        })

        transactions.getValue.forEach(t => {

            let paymentMethod = paymentMethods.getValue.find(pm => pm.getId().paymentMethodId === t.payment_method_id);

            response.push({
                id: t.id,
                currency: t.currency,
                price: t.price,
                walletId: t.wallet_id,
                paymentMethod:{
                    id: paymentMethod.getId().paymentMethodId,
                    name: paymentMethod.name.paymentMethodName,
                },
                date: t.date,
            });
        });

        return Result.success(new GetAllTransactionsApplicationResponseDTO(response));

    }
}