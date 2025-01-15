import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "../../domain/aggregate/cupon.aggregate";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";
import { CuponId } from "../../domain/value-object/cupon-id";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";

export interface IQueryCuponRepository {
    findAllCupons(criteria: FindAllCuponsApplicationRequestDTO): Promise<Result<Cupon[]>>;
    findCuponById(id:CuponId): Promise<Result<Cupon>>;
    findCuponByCode(code: CuponCode): Promise<Result<Cupon>>;
    verifyCuponExistenceByCode(code: CuponCode): Promise<Result<boolean>>;
    verifyCuponExistenceByName(name: CuponName): Promise<Result<boolean>>;
}
