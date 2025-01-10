import { Result } from "src/common/utils/result-handler/result"

export interface ICommandTransactionRepository<T> {
    saveTransaction(entry: T): Promise<Result<T>>
}