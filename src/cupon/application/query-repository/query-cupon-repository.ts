import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { UserId } from "src/user/domain/value-object/user-id";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser.entity";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { FindCuponByIdApplicationRequestDTO } from "../dto/request/find-cupon-by-id-application-requestdto";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";

export interface IQueryCuponRepository {
    findAllCupons(criteria: FindAllCuponsApplicationRequestDTO): Promise<Result<Cupon[]>>;
    findCuponById(criteria: FindCuponByIdApplicationRequestDTO): Promise<Result<Cupon>>;
    findCuponUserByUserIdAndCuponId(userId: UserId, cuponId: CuponId): Promise<Result<CuponUser>>;
    findCuponByCode(code:CuponCode): Promise<Result<Cupon>>;
    verifyCuponExistenceByName(name: CuponName): Promise<Result<boolean>>;
}
