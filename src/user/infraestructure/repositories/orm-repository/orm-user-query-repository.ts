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
import { OrmDirectionUserEntity } from "../../entities/orm-entities/orm-direction-user-entity";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { IUserDirection } from "src/user/application/model/user.direction.interface";
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton";



export class OrmUserQueryRepository extends Repository<OrmUserEntity> implements IQueryUserRepository{

    private mapper:IMapper <User,OrmUserEntity>
    private readonly ormDirectionRepository: Repository<OrmDirectionEntity>;
    private readonly ormDirectionUserRepository: Repository<OrmDirectionUserEntity>;

    constructor(dataSource:DataSource){
        super(OrmUserEntity, dataSource.createEntityManager())
        this.mapper=new OrmUserMapper(new UuidGen(),this)
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
            console.log(e)
            return Result.fail(new PersistenceException('Find user by id unsucssessfully'))
        }
    }
    async findUserDirectionsByUserId(id: UserId): Promise<Result<IUserDirection[]>> {
        try{
            let ormUser=await this.ormDirectionUserRepository.findBy({user_id:id.Value})
            if (!ormUser)
                return Result.fail(new PersistenceException('Find user direcction by id unsucssessfully'))
            let directions = ormUser.map(direction => ({
                id: direction.direction_id,
                name: direction.name,
                favorite: direction.isFavorite,
                lat: Number(direction.direction.lat),
                lng: Number(direction.direction.lng)
            }))
            return Result.success(directions)
        }catch(e){
            return Result.fail(new PersistenceException('Find user direcction by id unsucssessfully'))
        }    
    }

}