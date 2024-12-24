import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "../aggregate/cupon.aggregate";
import { CuponId } from "../value-object/cupon-id";
import { CuponName } from "../value-object/cupon-name";
import { CuponCode } from "../value-object/cupon-code";
import { CuponUser } from "../entities/cuponUser/cuponUser";

export interface ICuponRepository {
    createCupon(cupon: Cupon): Promise<Result<Cupon>>;
    deleteCuponById(id: CuponId): Promise<Result<CuponId>>;
    updateCupon(cupon: Cupon): Promise<Result<Cupon>>;
    findCuponById(id: CuponId): Promise<Result<Cupon>>;
    findCuponByCode(code: CuponCode): Promise<Result<Cupon>>;
    verifyCuponExistenceByCode(code: CuponCode): Promise<Result<boolean>>;
    verifyCuponExistenceByName(name: CuponName): Promise<Result<boolean>>;
    saveCuponUser(cuponUser: CuponUser): Promise<Result<boolean>>;
}
