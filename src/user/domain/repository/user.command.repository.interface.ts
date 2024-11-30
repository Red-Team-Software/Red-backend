import { Result } from "src/common/utils/result-handler/result";
import { User } from "../aggregate/user.aggregate";

export interface ICommandUserRepository {
    saveUser(user:User):Promise<Result<User>>
}