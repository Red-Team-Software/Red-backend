import { Result } from "src/common/utils/result-handler/result";
import { UserId } from "../../../user/domain/value-object/user-id";
import { UserCard } from "src/user/application/types/user-card-type";


export interface IUserExternalAccount {
    saveUser(userId: UserId,email: string): Promise<Result<string>>;
    saveCardtoUser(userId: string, cardId: string): Promise<Result<string>>;
    getUserCards(userId: string): Promise<Result<UserCard[]>>;
}