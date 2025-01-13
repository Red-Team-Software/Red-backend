import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IPaymentMethodModel } from "src/payment-methods/application/model/payment-method-model";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
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

        let paymentMethod: IPaymentMethodModel;

        if (transaction.getValue.payment_method_id) {
            let method = await this.paymentMethodQueryRepository.findMethodByIdDetail(
                PaymentMethodId.create(transaction.getValue.payment_method_id)
            );
            paymentMethod = method.getValue;
        }

        let response: ITypeTransaction = {
            id: transaction.getValue.id,
            currency: transaction.getValue.currency,
            price: transaction.getValue.price,
            walletId: transaction.getValue.wallet_id,
            paymentMethod:{
                id: paymentMethod.paymentMethodId,
                name: paymentMethod.paymentMethodName,
            },
            date: transaction.getValue.date,
        };

        return Result.success({ transactions: response });

    }
}