import { ISession } from "src/auth/application/model/session.interface"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/query-token-session-repository.interface"
import { Result } from "src/common/utils/result-handler/result"
import { UserId } from "src/user/domain/value-object/user-id"


export class OrmTokenQueryRepository implements IQueryTokenSessionRepository<ISession>{

  findSessionById(id: string): Promise<Result<ISession>> {
    throw new Error("Method not implemented.")
  }
  findAllTokenSessions(): Promise<Result<string[]>> {
    throw new Error("Method not implemented.")
  }
  findSessionLastSessionByUserId(id: UserId): Promise<Result<ISession>> {
    throw new Error("Method not implemented.")
  }
  
}