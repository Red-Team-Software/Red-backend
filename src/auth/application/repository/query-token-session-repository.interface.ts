import { Result } from "src/common/utils/result-handler/result"
import { UserId } from "src/user/domain/value-object/user-id"

export interface IQueryTokenSessionRepository<T> {
  findSessionById(id: string): Promise<Result<T>> 
  findAllTokenSessions(): Promise<Result<string[]>> 
  findSessionLastSessionByUserId(id: UserId): Promise<Result<T>>
}
