import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserDirection } from "src/user/domain/entities/directions/direction.entity";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";

export class UserCommandRepositoryMock implements ICommandUserRepository{

    constructor(private users: User[] = []){}

    async saveUser(user: User): Promise<Result<User>> {
        this.users.push(user)
        return Result.success(user)    
    }
    async updateUser(user: User): Promise<Result<User>> {
        this.users = this.users.filter((u) => u.getId().equals(user.getId()))
        this.users.push(user)
        return Result.success(user)        
    }
    async deleteUserDirection(idUser: UserId, direction:UserDirection): Promise<Result<UserId>> {
        let user= this.users.find((u) => u.getId().equals(idUser))
        user.deleteDirection(direction.getId())
        await this.updateUser(user)
        return Result.success(idUser)       
    }
}