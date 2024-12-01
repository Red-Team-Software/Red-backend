import { Result } from "src/common/utils/result-handler/result"

export interface IQueryTokenSessionRepository<T> {
  findSessionById(id: string): Promise<Result<T>> 
  findAllTokenSessions(): Promise<Result<string[]>> 
}
