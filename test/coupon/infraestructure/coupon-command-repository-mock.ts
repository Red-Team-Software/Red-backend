import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { ICommandCuponRepository } from "src/cupon/domain/repository/command-cupon-repository";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";

export class CuponCommandRepositoryMock implements ICommandCuponRepository {

    constructor(private cupones: Cupon[] = []) {}

    async createCupon(cupon: Cupon): Promise<Result<Cupon>> {
        // Agregar el cupon al repositorio simulado
        this.cupones.push(cupon);
        return Result.success(cupon);
    }

    async deleteCuponById(id: CuponId): Promise<Result<CuponId>> {
        // Eliminar el cupon por su ID
        this.cupones = this.cupones.filter((c) => !c.getId().equals(id));
        return Result.success(id);
    }

    async updateCupon(cupon: Cupon): Promise<Result<Cupon>> {
        // Actualizar el cupon en el repositorio simulado
        this.cupones = this.cupones.filter((c) => !c.getId().equals(cupon.getId()));
        this.cupones.push(cupon);
        return Result.success(cupon);
    }
}
