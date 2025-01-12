import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser.entity";
import { CuponUserId } from "../entities/cuponUser/value-objects/cuponUserId";

export interface ICommandCuponRepository {
    createCupon(cupon: Cupon): Promise<Result<Cupon>>;
    deleteCuponById(id: CuponId): Promise<Result<CuponId>>;
    updateCupon(cupon: Cupon): Promise<Result<Cupon>>;
    registerCuponUser(cuponUser: CuponUser): Promise<Result<boolean>>;
    updateCuponUser(cuponUser:CuponUser): Promise<Result<CuponUser>>;
}