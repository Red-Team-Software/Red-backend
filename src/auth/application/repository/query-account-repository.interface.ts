import { Result } from "src/common/utils/result-handler/result"

export interface IQueryAccountRepository<T> {
  findAccountByEmail(email: string): Promise<Result<T>>
  findAccountById(id: string): Promise<Result<T>>
  verifyAccountExistanceByEmail(email:string):Promise<Result<boolean>>
}

