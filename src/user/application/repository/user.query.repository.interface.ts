import { Result } from "src/common/utils/result-handler/result";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserId } from "src/user/domain/value-object/user-id";

export interface IQuertUserRepository {
    findUserById(id:UserId):Promise<Result<User>>
}