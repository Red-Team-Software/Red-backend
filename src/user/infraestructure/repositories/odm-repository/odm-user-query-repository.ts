import { Result } from "src/common/utils/result-handler/result";
import { IDirection } from "src/user/application/model/direction-interface";
import { IUserDirection } from "src/user/application/model/user.direction.interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { User } from "src/user/domain/aggregate/user.aggregate";
import { UserDirection } from "src/user/domain/entities/directions/direction.entity";
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserPhone } from "src/user/domain/value-object/user-phone";


export class OdmUserQueryRepository implements IQueryUserRepository{
    
    findUserById(id: UserId): Promise<Result<User>> {
        throw new Error("Method not implemented.");
    }
    findUserByPhoneNumber(phoneNumber: UserPhone): Promise<Result<User>> {
        throw new Error("Method not implemented.");
    }
    verifyUserExistenceByPhoneNumber(phoneNumber: UserPhone): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }
    findUserDirectionsByUserId(id: UserId): Promise<Result<IUserDirection[]>> {
        throw new Error("Method not implemented.");
    }
    findDirectionsByLatAndLng(userDirection: UserDirection[]): Promise<Result<IDirection[]>> {
        throw new Error("Method not implemented.");
    }
    findDirectionById(id: DirectionId, userId: UserId): Promise<Result<UserDirection>> {
        throw new Error("Method not implemented.");
    }


}