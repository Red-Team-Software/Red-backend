import { Result } from "src/common/utils/result-handler/result";
import { User } from "../aggregate/user.aggregate";

export interface IUserCommandRepository {
    save(user:User):Result<User>
}