import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { Result } from "src/common/utils/result-handler/result";
import { IDirection } from "src/user/application/model/direction-interface";
import { IUserDirection } from "src/user/application/model/user.direction.interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserDirection } from "src/user/domain/entities/directions/direction.entity";
import { DirectionId } from "src/user/domain/entities/directions/value-objects/Direction-id";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserPhone } from "src/user/domain/value-object/user-phone";


export class UserQueryRepositoryMock implements IQueryUserRepository{


    constructor(
        private readonly users: User[] = [],
        private readonly idGen: IIdGen<string>
    ){}


    async findDirectionById(id: DirectionId, userId: UserId): Promise<Result<UserDirection>> {
        let user=this.users.find(u=>u.getId().equals(userId))
        if (!user)
            return Result.fail(new PersistenceException('Find user direction by id unsucssessfully'))
        let direction=user.UserDirections.find(d=>d.getId().equals(id))
        if (!direction)
            return Result.fail(new PersistenceException('Find user direction by id unsucssessfully'))
        return Result.success(direction)
    }

    async findUserById(id: UserId): Promise<Result<User>> {
        let user=this.users.find((u) => u.getId().equals(id))
        if (!user)
            return Result.fail(new PersistenceException('Find user by id unsucssessfully'))
        return Result.success(user)
    }
    async findUserByPhoneNumber(phoneNumber: UserPhone): Promise<Result<User>> {
        let user=this.users.find((u) => u.UserPhone.equals(phoneNumber))
        if (!user)
            return Result.fail(new PersistenceException('Find user by phoneNumber unsucssessfully'))
        return Result.success(user)    
    }
    async verifyUserExistenceByPhoneNumber(phoneNumber: UserPhone): Promise<Result<boolean>> {
        let user=this.users.find((u) => u.UserPhone.equals(phoneNumber))
        if (!user)
            return Result.success(true)
        return Result.success(false)     
    }
    async findUserDirectionsByUserId(id: UserId): Promise<Result<IUserDirection[]>> {
        let user=this.users.find((u) => u.getId().equals(id))
        
        if (!user)
            return Result.fail(new PersistenceException('Find user by user direction unsucssessfully'))

        let directions:IUserDirection[]=[]

        for (const direction of user.UserDirections) {
            directions.push({
                id: await this.idGen.genId(),
                name: direction.DirectionName.Value,
                isFavorite: direction.DirectionFavorite.Value,
                lat: direction.DirectionLat.Value,
                lng: direction.DirectionLng.Value
            })
        }

        return Result.success(directions)
    }
    async findDirectionsByLatAndLng(userDirection: UserDirection[]): Promise<Result<IDirection[]>> {

        const user = this.users.find((u) => 
          u.UserDirections.some((d) => 
            userDirection.some((ud) => ud.equals(d))
          )
        )

        if (!user)
            return Result.fail(new PersistenceException('Find direction by lat and lng unsucssessfully'))
        
        let direction = user.UserDirections.find((d) => 
            userDirection.some((ud) => ud.equals(d))
        )
        
        return Result.success(
            [{
                id: await this.idGen.genId(),
                name: direction.DirectionName.Value,
                favorite: direction.DirectionFavorite.Value,
                lat: direction.DirectionLat.Value,
                lng: direction.DirectionLng.Value
            }]
        )
    }

}