import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { Repository, DataSource } from "typeorm";
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmUserMapper } from "../../mapper/orm-mapper/orm-user-mapper";
import { OrmDirectionEntity } from "../../entities/orm-entities/orm-direction-entity";
import { OrmDirectionUserEntity } from "../../entities/orm-entities/orm-direction-user-entity";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { OrmUserQueryRepository } from "./orm-user-query-repository";
import { OrmWalletEntity } from "../../entities/orm-entities/orm-wallet-entity";



export class OrmUserCommandRepository extends Repository<OrmUserEntity> implements ICommandUserRepository{

    private mapper:IMapper <User,OrmUserEntity>
    private readonly ormDirectionRepository: Repository<OrmDirectionEntity>;
    private readonly ormDirectionUserRepository: Repository<OrmDirectionUserEntity>;
    private readonly ormWalletRepository: Repository<OrmWalletEntity>;

    constructor(dataSource:DataSource){
        super(OrmUserEntity, dataSource.createEntityManager())
        this.mapper=new OrmUserMapper(new UuidGen(),new OrmUserQueryRepository(dataSource))
        this.ormDirectionRepository=dataSource.getRepository(OrmDirectionEntity)
        this.ormDirectionUserRepository=dataSource.getRepository(OrmDirectionUserEntity)
        this.ormWalletRepository=dataSource.getRepository(OrmWalletEntity)
    }
    async deleteUserDirection(idUser:string,idDirection:string): Promise<Result<string>> {
        try {
    
            let resultDelete = await this.ormDirectionUserRepository.delete({
                direction_id:idDirection,
                user_id:idUser
            })
                    
            if (!resultDelete)
                return Result.fail(new PersistenceException('Update user unsucssessfully'))
            
            return Result.success(idUser)
            } catch (e) {
                return Result.fail(new PersistenceException('Update user unsucssessfully'))
            }  
        }    

    async updateUser(user: User): Promise<Result<User>> {
    try {
        let ormModel=await this.mapper.fromDomaintoPersistence(user)

        let resultUpdate = await this.upsert(ormModel,['id'])
        
        for (const directionUser of ormModel.direcction){
            await this.ormDirectionRepository.upsert(directionUser.direction,['id'])
            await this.ormDirectionUserRepository.upsert(directionUser,['direction_id','user_id'])
        }
    
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
            await this.ormWalletRepository.save(ormUser.wallet)
            let response =await this.save(ormUser)
            if (!response)
                return Result.fail( new PersistenceException('Create user unsucssessfully') )
            return Result.success(user)
        }catch(e){
            return Result.fail( new PersistenceException('Create user unsucssessfully') )
        }
    }
}