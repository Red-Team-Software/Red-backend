import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { Repository, DataSource } from "typeorm";
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmUserMapper } from "../../mapper/orm-mapper/orm-user-mapper";
import { OrmDirectionEntity } from "../../entities/orm-entities/orm-direction-entity";
import { OrmDirectionUserEntity } from "../../model-entity/orm-model-entity/orm-direction-user-entity";



export class OrmUserCommandRepository extends Repository<OrmUserEntity> implements ICommandUserRepository{

    private mapper:IMapper <User,OrmUserEntity>
    private readonly ormDirectionRepository: Repository<OrmDirectionEntity>;
    private readonly ormDirectionUserRepository: Repository<OrmDirectionUserEntity>;

    constructor(dataSource:DataSource){
        super(OrmUserEntity, dataSource.createEntityManager())
        this.mapper=new OrmUserMapper()
        this.ormDirectionRepository=dataSource.getRepository(OrmDirectionEntity)
        this.ormDirectionUserRepository=dataSource.getRepository(OrmDirectionUserEntity)
    }
    async updateUser(user: User): Promise<Result<User>> {
    try {
        let ormModel=await this.mapper.fromDomaintoPersistence(user)

        let resultUpdate = await this.upsert(ormModel,['id'])         
    
            if (!resultUpdate)
                return Result.fail(new PersistenceException('Update user unsucssessfully'))
          
            return Result.success(user)
        } catch (e) {
            return Result.fail(new PersistenceException('Update user unsucssessfully'))
        }  
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