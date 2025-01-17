import { Result } from "src/common/utils/result-handler/result";
import { IDirection } from "src/user/application/model/direction-interface";
import { IUserDirection } from "src/user/application/model/user.direction.interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserDirection } from "src/user/domain/entities/directions/direction.entity";
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { OdmUserEntity, OdmUserSchema } from "../../entities/odm-entities/odm-user-entity";
import { OdmUserMapper } from "../../mapper/odm-mapper/odm-user-mapper";
import { Model, Mongoose } from "mongoose";
import { OdmPromotionEntity, OdmPromotionSchema } from "src/promotion/infraestructure/entities/odm-entities/odm-promotion-entity";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";


export class OdmUserQueryRepository implements IQueryUserRepository{

    private readonly model: Model<OdmUserEntity>;
    private readonly odmMapper: OdmUserMapper

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmUserEntity>('odmuser', OdmUserSchema)
        this.odmMapper= new OdmUserMapper()
    }
    
    async findUserById(id: UserId): Promise<Result<User>> {
        try{
            let odm=await this.model.findOne({id:id.Value})
            
            if(!odm)
                return Result.fail( new NotFoundException('Find User unsucssessfully'))
            
            return Result.success(await this.odmMapper.fromPersistencetoDomain(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find User unsucssessfully'))
        }
    }
    async findUserByPhoneNumber(phoneNumber: UserPhone): Promise<Result<User>> {
        try{
            let odm=await this.model.findOne({phone:phoneNumber.Value})
            
            if(!odm)
                return Result.fail( new NotFoundException('Find User unsucssessfully'))
            
            return Result.success(await this.odmMapper.fromPersistencetoDomain(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find User unsucssessfully'))
        }
    }
    async verifyUserExistenceByPhoneNumber(phoneNumber: UserPhone): Promise<Result<boolean>> {
        try{
            let odm=await this.model.findOne({phone:phoneNumber.Value}) 
            if(!odm)
                return Result.success(false)
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find User unsucssessfully'))
        }
    }
    async findUserDirectionsByUserId(id: UserId): Promise<Result<IUserDirection[]>> {
        try{
            let odm=await this.model.findOne({id:id.Value}) 
            if(!odm)
                return Result.fail( new NotFoundException('Find User unsucssessfully'))
            let domain=await this.odmMapper.fromPersistencetoDomain(odm)
            return Result.success(domain.UserDirections.map(d=>({
                id:d.getId().Value,
                name: d.DirectionName.Value,
                isFavorite: d.DirectionFavorite.Value,
                lat: Number(d.DirectionLat.Value),
                lng: Number(d.DirectionLng.Value)
            })))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find User unsucssessfully'))
        }    
    }
    findDirectionsByLatAndLng(userDirection: UserDirection[]): Promise<Result<IDirection[]>> {
        throw new Error("Method not implemented.");
    }
    async findDirectionById(id: DirectionId, userId: UserId): Promise<Result<UserDirection>> {
        try{
            let odm=await this.model.findOne({id:userId.Value,
                "direction.id": id.Value
            }) 
            if(!odm)
                return Result.fail( new NotFoundException('Find User unsucssessfully'))
            let domain=await this.odmMapper.fromPersistencetoDomain(odm)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find User unsucssessfully'))
        } 
    }

}