import { ISession } from "src/auth/application/model/session.interface"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/Query-token-session-repository.interface"
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { Result } from "src/common/utils/result-handler/result"
import { Repository, DataSource } from "typeorm"
import { OrmAccountEntity } from "../../orm/orm-entities/orm-account-entity"
import { OrmSessionEntity } from "../../orm/orm-entities/orm-session-entity"
import { Session } from "@nestjs/common"



export class OrmTokenQueryRepository extends Repository<OrmSessionEntity> implements IQueryTokenSessionRepository<ISession>{

    private readonly ormAccountRepository: Repository<OrmAccountEntity>

    constructor(dataSource:DataSource){
        super(OrmSessionEntity, dataSource.createEntityManager())
        this.ormAccountRepository=dataSource.getRepository( OrmAccountEntity )
    }
  async findSessionById(id: string): Promise<Result<ISession>> {
    try{
      console.log(id)
      const ormSession=await this.findOneBy({id})
      console.log(ormSession)
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