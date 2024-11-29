import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { Repository, DataSource } from "typeorm";
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmUserMapper } from "../../mapper/orm-mapper/orm-user-mapper";



export class OrmUserCommandRepository extends Repository<OrmUserEntity> implements ICommandUserRepository{

    private mapper:IMapper <User,OrmUserEntity>
    constructor(dataSource:DataSource){
        super(OrmUserEntity, dataSource.createEntityManager())
        this.mapper=new OrmUserMapper()
    }
    async saveUser(user: User): Promise<Result<User>> {
        try{
            let ormUser=await this.mapper.fromDomaintoPersistence(user)
            let response =await this.save(ormUser)
            if (!response)
                return Result.fail( new PersistenceException('Create user unsucssessfully') )
            return Result.success(user)
        }catch(e){
            return Result.fail( new PersistenceException('Create user unsucssessfully') )
        }
    }
}