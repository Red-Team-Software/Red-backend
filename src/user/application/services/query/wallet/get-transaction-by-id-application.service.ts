import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { NotFoundTransactionApplicationException } from "src/user/application/application-exeption/not-found-transaction-application.exception";
import { GetTransactionByIdApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-transaction-by-id-application-request-dto";
import { GetTransactionByIdApplicationResponseDTO } from "src/user/application/dto/response/wallet/get-transaction-by-id-application-response-dto";
import { ITransaction } from "src/user/application/model/transaction-interface";
import { IQueryTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction-query-repository.interface";
import { ITypeTransaction } from "src/user/application/types/transaction-type";


export class FindTransactionByIdApplicationService extends IApplicationService<GetTransactionByIdApplicationRequestDTO,GetTransactionByIdApplicationResponseDTO>{
    
    constructor(
        private transactionQueryRepository: IQueryTransactionRepository<ITransaction>,
        private paymentMethodQueryRepository: IPaymentMethodQueryRepository
    ){
        super()
    }
    
    async execute(data: GetTransactionByIdApplicationRequestDTO): Promise<Result<GetTransactionByIdApplicationResponseDTO>> {

        let transaction = await this.transactionQueryRepository.getTransactionById(data.transactionId);

        if (!transaction.isSuccess())
            return Result.fail(new NotFoundTransactionApplicationException());

        let paymentMethods = await this.paymentMethodQueryRepository.findAllMethods({
            userId: data.userId,
            page: 0,
            perPage: 200,
        });

        let paymentMethod = paymentMethods.getValue.find(
            pm => pm.getId().paymentMethodId === transaction.getValue.payment_method_id);

        let response: ITypeTransaction = {
            id: transaction.getValue.id,
            currency: transaction.getValue.currency,
            price: transaction.getValue.price,
            walletId: transaction.getValue.wallet_id,
            paymentMethod:{
                id: paymentMethod.getId().paymentMethodId,
                name: paymentMethod.name.paymentMethodName,
            },
            date: transaction.getValue.date,
        };

        return Result.success({ transactions: response });

    }
}