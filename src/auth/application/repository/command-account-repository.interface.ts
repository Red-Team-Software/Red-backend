import { Result } from "src/common/utils/result-handler/result"

export interface ICommandAccountRepository<T> {
  createAccount(entry: T): Promise<Result<T>>
  updateAccount(entry: T): Promise<Result<T>>
  deleteAccountById(id: string): Promise<Result<string>>
  changeConfirmedVerification(email:string,verification:boolean):Promise<Result<T>>
}

