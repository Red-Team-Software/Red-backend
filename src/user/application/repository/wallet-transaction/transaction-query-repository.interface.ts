import { Result } from "src/common/utils/result-handler/result"
import { ITransaction } from "../../model/transaction-interface";

export interface IQueryTransactionRepository<T> {
  getAllTransactionsByWalletId(walletId: string, page:number, perPage: number): Promise<Result<ITransaction[]>>;
  getTransactionById(id: string): Promise<Result<T>>;
}

