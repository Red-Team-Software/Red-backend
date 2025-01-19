import { Result } from "src/common/utils/result-handler/result";
import { IQueryCuponRepository } from "src/cupon/application/query-repository/query-cupon-repository";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";

export class CouponQueryRepositoryMock implements IQueryCuponRepository {

    constructor(private cupones: Cupon[] = []) {}

    async findAllCupons(criteria: FindAllCuponsApplicationRequestDTO): Promise<Result<Cupon[]>> {
        const cupones = this.cupones.slice(criteria.page, criteria.perPage);
        return Result.success(cupones);
    }

    async findCuponById(cuponId: CuponId): Promise<Result<Cupon>> {
        const cupon = this.cupones.find((c) => c.getId().equals(cuponId));
        if (!cupon) {
            return Result.fail(new NotFoundException("Cupon not found"));
        }
        return Result.success(cupon);
    }

    async findCuponByCode(code: CuponCode): Promise<Result<Cupon>> {
        const cupon = this.cupones.find((c) => c.CuponCode.equals(code));
        if (!cupon) {
            return Result.fail(new NotFoundException("Cupon not found"));
        }
        return Result.success(cupon);
    }

    async verifyCuponExistenceByCode(code: CuponCode): Promise<Result<boolean>> {
        const cupon = this.cupones.find((c) => c.CuponCode.equals(code));
        return Result.success(cupon != null);
    }

    async verifyCuponExistenceByName(name: CuponName): Promise<Result<boolean>> {
        const cupon = this.cupones.find((c) => c.CuponName.equals(name));
        if(!cupon){
            return Result.success(false);
        }
        return Result.success(true);
    }
}
