import { ISession } from "src/auth/application/model/session.interface"
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface"
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { Result } from "src/common/utils/result-handler/result"
import { Repository, DataSource } from "typeorm"
import { OrmAccountEntity } from "../../orm/orm-entities/orm-account-entity"
import { OrmSessionEntity } from "../../orm/orm-entities/orm-session-entity"



export class OrmTokenCommandRepository extends Repository<OrmSessionEntity> implements ICommandTokenSessionRepository<ISession>{

    private readonly ormAccountRepository: Repository<OrmAccountEntity>

    constructor(dataSource:DataSource){
        super(OrmSessionEntity, dataSource.createEntityManager())
        this.ormAccountRepository=dataSource.getRepository( OrmAccountEntity )
    }
  async createSession(entry: ISession): Promise<Result<ISession>> {
    try{
      let session=OrmSessionEntity.create(
        entry.id,
        entry.expired_at,
        entry.push_token,
        entry.accountId
      )

      let ormAccount=await this.ormAccountRepository.findOneBy({id:session.accountId})

      if (!ormAccount)
        return Result.fail( new PersistenceException('Create session unsucssessfully') )

      session.account=ormAccount

      let ormSession=await this.save(session)

      if (!ormSession)
        return Result.fail( new PersistenceException('Create session unsucssessfully') )

      return Result.success(entry)

    }catch(e){
      return Result.fail( new PersistenceException('Create session unsucssessfully') )
    }
  }
  async updateSession(entry: ISession): Promise<Result<ISession>> {
    throw new Error("Method not implemented.");
  }
  async deleteSessionById(id: string): Promise<Result<string>> {
    throw new Error("Method not implemented.");
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
  async findAllTokenSessionsByUserId(id: string): Promise<Result<ISession[]>> {
    throw new Error("Method not implemented.");
  }
  
}