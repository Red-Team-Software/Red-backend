import { Result } from "src/common/utils/result-handler/result"

export interface ICommandTokenSessionRepository<T> {
  create(entry: T): Promise<Result<T>>
  update(entry: T): Promise<Result<T>>
  deleteById(id: string): Promise<Result<string>>
  findById(id: string): Promise<Result<T>> 
  findAllTokenSessionsByUserId(id: string): Promise<Result<T[]>> 
}
