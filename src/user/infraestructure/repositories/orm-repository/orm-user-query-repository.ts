import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { Repository, DataSource } from "typeorm";
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity";
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmUserMapper } from "../../mapper/orm-mapper/orm-user-mapper";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrmDirectionUserEntity } from "../../entities/orm-entities/orm-direction-user-entity";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { IUserDirection } from "src/user/application/model/user.direction.interface";
import { IDirection } from "src/user/application/model/direction-interface";
import { UserDirection } from "src/user/domain/entities/directions/direction.entity";
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id";
import { DirectionFavorite } from "src/user/domain/entities/directions/value-objects/direction-favorite";
import { DirectionLat } from "src/user/domain/entities/directions/value-objects/direction-lat";
import { DirectionLng } from "src/user/domain/entities/directions/value-objects/direction-lng";
import { DirectionName } from "src/user/domain/entities/directions/value-objects/direction-name";



export class OrmUserQueryRepository extends Repository<OrmUserEntity> implements IQueryUserRepository{

    private mapper:IMapper <User,OrmUserEntity>
    private readonly ormDirectionUserRepository: Repository<OrmDirectionUserEntity>;

    constructor(dataSource:DataSource){
        super(OrmUserEntity, dataSource.createEntityManager())
        this.mapper=new OrmUserMapper(new UuidGen(),this)
        this.ormDirectionUserRepository=dataSource.getRepository(OrmDirectionUserEntity)
    }

   async verifyUserExistenceByPhoneNumber(phoneNumber: UserPhone): Promise<Result<boolean>> {
    try{
        const account = await this.findOneBy({phone:phoneNumber.Value})
        if(account) return Result.success(true)
            return Result.success(false)
        }
    catch(e){
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
    async findUserDirectionsByUserId(id: UserId): Promise<Result<IUserDirection[]>> {
        try{
            let ormUser=await this.ormDirectionUserRepository.findBy({user_id:id.Value})
            if (!ormUser)
                return Result.fail(new PersistenceException('Find user direcction by id unsucssessfully'))
            let directions = ormUser.map(direction => ({
                id: direction.id,
                name: direction.name,
                isFavorite: direction.isFavorite,
                lat: Number(direction.lat),
                lng: Number(direction.lng)
            }))
            return Result.success(directions)
        }catch(e){
            return Result.fail(new PersistenceException('Find user direcction by id unsucssessfully'))
        }    
    }

    async findDirectionsByLatAndLng(userDirection:UserDirection[]): Promise<Result<IDirection[]>> {
        try{
            let directions:IDirection[]=[]
            for (const direction of userDirection){
                let ormDirection=await this.ormDirectionUserRepository.findOneBy({
                    lat:direction.DirectionLat.Value,
                    lng:direction.DirectionLng.Value
                })
                if (ormDirection)
                    directions.push(ormDirection)
            }
            return Result.success(directions)
        }catch(e){
            return Result.fail(new PersistenceException('Find direcction by lat and lng unsucssessfully'))
        }    
    }

    async findDirectionById(id:DirectionId,userId:UserId):Promise<Result<UserDirection>>{
        try{
            let ormDirection=await this.ormDirectionUserRepository.findOneBy({
            id:id.Value,
            user_id:userId.Value
            })
            if (!ormDirection)
                return Result.fail(new PersistenceException('Find direcction by id unsucssessfully'))

            return Result.success(UserDirection.create(
                id,
                DirectionFavorite.create(ormDirection.isFavorite),
                DirectionLat.create(Number(ormDirection.lat)),
                DirectionLng.create(Number(ormDirection.lng)),
                DirectionName.create(ormDirection.name)
            ))
        }catch(e){
            return Result.fail(new PersistenceException('Find direcction by id unsucssessfully'))
        }    
    }

}