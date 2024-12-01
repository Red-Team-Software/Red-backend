import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { Repository, DataSource } from "typeorm";
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity";
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmUserMapper } from "../../mapper/orm-mapper/orm-user-mapper";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserDirection } from "src/user/domain/value-object/user-direction";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrmDirectionEntity } from "../../entities/orm-entities/orm-direction-entity";
import { OrmDirectionUserEntity } from "../../model-entity/orm-model-entity/orm-direction-user-entity";
import { UserPhone } from "src/user/domain/value-object/user-phone";



export class OrmUserQueryRepository extends Repository<OrmUserEntity> implements IQueryUserRepository{

    private mapper:IMapper <User,OrmUserEntity>
    private readonly ormDirectionRepository: Repository<OrmDirectionEntity>;
    private readonly ormDirectionUserRepository: Repository<OrmDirectionUserEntity>;

    constructor(dataSource:DataSource){
        super(OrmUserEntity, dataSource.createEntityManager())
        this.mapper=new OrmUserMapper()
        this.ormDirectionRepository=dataSource.getRepository(OrmDirectionEntity)
        this.ormDirectionUserRepository=dataSource.getRepository(OrmDirectionUserEntity)
    }
   async verifyUserExistenceByPhoneNumber(phoneNumber: UserPhone): Promise<Result<boolean>> {
    try{
        const account = await this.findOneBy({phone:phoneNumber.Value})
        if(account) return Result.success(true)
            return Result.success(false)
        }
    catch(e){
        console.log(e)
            return Result.fail( new NotFoundException('Veify User existance unsucssessfully '))
        }
    }
    async findUserByPhoneNumber(phoneNumber: UserPhone): Promise<Result<User>> {
        try{
            let ormUser=await this.findOneBy({phone:phoneNumber.Value})
            if (!ormUser)
                return Result.fail(new PersistenceException('Find user by phone unsucssessfully'))
            let user= await this.mapper.fromPersistencetoDomain(ormUser)
            return Result.success(user)
        }catch(e){
            return Result.fail(new PersistenceException('Find user by phone unsucssessfully'))
        }
    }

    async findUserById(id: UserId): Promise<Result<User>> {
        try{
            let ormUser=await this.findOneBy({id:id.Value})
            if (!ormUser)
                return Result.fail(new PersistenceException('Find user by id unsucssessfully'))
            let user= await this.mapper.fromPersistencetoDomain(ormUser)
            return Result.success(user)
        }catch(e){
            return Result.fail(new PersistenceException('Find user by id unsucssessfully'))
        }
    }
    async findUserDirectionsByUserId(id: UserId): Promise<Result<UserDirection[]>> {
        try{
            let ormUser=await this.findOneBy({id:id.Value})
            if (!ormUser)
                return Result.fail(new PersistenceException('Find user direcction by id unsucssessfully'))
            let user= await this.mapper.fromPersistencetoDomain(ormUser)
            return Result.success(user.UserDirections)
        }catch(e){
            return Result.fail(new PersistenceException('Find user direcction by id unsucssessfully'))
        }    
    }

}