import { ISession } from "src/auth/application/model/session.interface"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/Query-token-session-repository.interface"
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { Result } from "src/common/utils/result-handler/result"
import { Repository, DataSource } from "typeorm"
import { OrmAccountEntity } from "../../orm/orm-entities/orm-account-entity"
import { OrmSessionEntity } from "../../orm/orm-entities/orm-session-entity"



export class OrmTokenQueryRepository extends Repository<OrmSessionEntity> implements IQueryTokenSessionRepository<ISession>{

    private readonly ormAccountRepository: Repository<OrmAccountEntity>

    constructor(dataSource:DataSource){
        super(OrmSessionEntity, dataSource.createEntityManager())
        this.ormAccountRepository=dataSource.getRepository( OrmAccountEntity )
    }
  async findSessionById(id: string): Promise<Result<ISession>> {
    try{
      const ormSession=await this.findOneBy({id})
      
      if(!ormSession)
          return Result.fail( new NotFoundException('Find session unsucssessfully'))

      return Result.success(ormSession)
  }catch(e){
      return Result.fail( new NotFoundException('Find session unsucssessfully'))
  }    
  }
  async findAllTokenSessions(): Promise<Result<string[]>> {
    try{
      const sessions = await this.createQueryBuilder("session")
      .select("session.push_token")
      .getMany()
      const tokens = sessions.map(session => session.push_token) 
      return Result.success(tokens)
      }catch(e){
      return Result.fail( new NotFoundException('Error finding all emails'))
  }   
}
  
}