import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserDirection } from "src/user/domain/value-object/user-direction";
import { UserId } from "src/user/domain/value-object/user-id";

export interface IQueryUserRepository {
    findUserById(id:UserId):Promise<Result<User>>
    findUserDirectionsByUserId(id:UserId):Promise<Result<UserDirection[]>>
}