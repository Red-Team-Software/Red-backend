import { Result } from "src/common/utils/result-handler/result"

export interface ICommandTokenSessionRepository<T> {
  createSession(entry: T): Promise<Result<T>>
  updateSession(entry: T): Promise<Result<T>>
  deleteSessionById(id: string): Promise<Result<string>>
}
