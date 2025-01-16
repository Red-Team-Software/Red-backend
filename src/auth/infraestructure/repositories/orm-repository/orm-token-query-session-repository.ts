import { ISession } from "src/auth/application/model/session.interface"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/query-token-session-repository.interface"
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { Result } from "src/common/utils/result-handler/result"
import { Repository, DataSource } from "typeorm"
import { OrmAccountEntity } from "../../account/orm-entities/orm-account-entity"
import { OrmSessionEntity } from "../../account/orm-entities/orm-session-entity"
import { UserId } from "src/user/domain/value-object/user-id"
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity"



export class OrmTokenQueryRepository extends Repository<OrmSessionEntity> implements IQueryTokenSessionRepository<ISession>{

    private readonly ormAccountRepository: Repository<OrmAccountEntity>
    private readonly ormUserRepository: Repository<OrmUserEntity>


    constructor(dataSource:DataSource){
        super(OrmSessionEntity, dataSource.createEntityManager())
        this.ormAccountRepository=dataSource.getRepository( OrmAccountEntity )
        this.ormUserRepository=dataSource.getRepository(OrmUserEntity)
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

  async findSessionLastSessionByUserId(id: UserId): Promise<Result<ISession>> {
    try{
      const user=await this.ormUserRepository.findOneBy({id:id.Value})
      const ormAccount=await this.ormAccountRepository.findOne(
        {
          where:{user},
          order:{code_created_at:'DESC'}
        }          
      )
      const ormSession=await this.findOneBy({account:ormAccount})      
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