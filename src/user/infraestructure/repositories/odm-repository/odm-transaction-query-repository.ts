import { Result } from "src/common/utils/result-handler/result"
import { ITransaction } from "src/user/application/model/transaction-interface"
import { IQueryTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction-query-repository.interface"


export class OdmTransactionQueryRepository  implements IQueryTransactionRepository<ITransaction>{
    
    getAllTransactionsByWalletId(walletId: string, page: number, perPage: number): Promise<Result<ITransaction[]>> {
        throw new Error("Method not implemented.")
    }
    getTransactionById(id: string): Promise<Result<ITransaction>> {
        throw new Error("Method not implemented.")
    }

}