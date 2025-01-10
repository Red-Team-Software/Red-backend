import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "../aggregate/cupon.aggregate";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";
import { FindCuponByIdApplicationRequestDTO } from "src/cupon/application/dto/request/find-cupon-by-id-application-requestdto";
import { CuponId } from "../value-object/cupon-id";

export interface IQueryCuponRepository {
    findAllCupons(criteria: FindAllCuponsApplicationRequestDTO): Promise<Result<Cupon[]>>;
    findCuponById(id:CuponId): Promise<Result<Cupon>>;
}
