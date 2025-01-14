import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "../aggregate/cupon.aggregate";
import { CuponId } from "../value-object/cupon-id";

export interface ICuponRepository {
    createCupon(cupon: Cupon): Promise<Result<Cupon>>;
    deleteCuponById(id: CuponId): Promise<Result<CuponId>>;
    updateCupon(cupon: Cupon): Promise<Result<Cupon>>;
}
