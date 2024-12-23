import { Result } from "src/common/utils/result-handler/result";
import { User } from "../aggregate/user.aggregate";
import { UserId } from "../value-object/user-id";
import { UserDirection } from "../value-object/user-direction";

export interface ICommandUserRepository {
    saveUser(user:User):Promise<Result<User>>
    updateUser(user:User):Promise<Result<User>>
    deleteUserDirection(idUser:UserId,direction:UserDirection):Promise<Result<UserId>>
}