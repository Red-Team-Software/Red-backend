import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { IUserDirection } from "../model/user.direction.interface";
import { IDirection } from "../model/direction-interface";
import { UserDirection } from "src/user/domain/entities/directions/direction.entity";
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id";

export interface IQueryUserRepository {
    findUserById(id:UserId):Promise<Result<User>>
    findUserByPhoneNumber(phoneNumber:UserPhone):Promise<Result<User>>
    verifyUserExistenceByPhoneNumber(phoneNumber:UserPhone): Promise<Result<boolean>> 
    findUserDirectionsByUserId(id:UserId):Promise<Result<IUserDirection[]>>
    findDirectionsByLatAndLng(userDirection:UserDirection[]): Promise<Result<IDirection[]>>
    findDirectionById(id:DirectionId,userId:UserId):Promise<Result<UserDirection>>
}