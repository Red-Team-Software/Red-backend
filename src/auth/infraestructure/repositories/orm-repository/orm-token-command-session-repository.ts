import { OrmAccountEntity } from "../../orm/orm-entities/orm-account-entity";
import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/utils/result-handler/result";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { OrmSessionEntity } from "../../orm/orm-entities/orm-session-entity";
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface";
import { ISession } from "src/auth/application/model/session.interface";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";


export class OrmTokenCommandRepository extends Repository<OrmSessionEntity> implements ICommandTokenSessionRepository<ISession>{

    private readonly ormUserRepository: Repository<OrmUserEntity>

    constructor(dataSource:DataSource){
        super(OrmAccountEntity, dataSource.createEntityManager())
        this.ormUserRepository=dataSource.getRepository( OrmUserEntity )
    }
  async createSession(entry: ISession): Promise<Result<ISession>> {
    try{
      let session=OrmSessionEntity.create(entry.id,entry.expired_at,entry.push_token,entry.accountId)
      
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
    throw new Error("Method not implemented.");
  }
  async findAllTokenSessionsByUserId(id: string): Promise<Result<ISession[]>> {
    throw new Error("Method not implemented.");
  }
  
}