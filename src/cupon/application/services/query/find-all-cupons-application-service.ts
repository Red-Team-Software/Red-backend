import { IApplicationService } from "src/common/application/services";
import { IQueryCuponRepository } from "src/cupon/application/query-repository/query-cupon-repository";
import { Result } from "src/common/utils/result-handler/result";
import { FindAllCuponsApplicationRequestDTO } from "../../dto/request/find-all-cupons-application-RequestDTO";
import { FindAllCuponsApplicationResponseDTO } from "../../dto/response/find-all-cupons-application-responsedto";
import { NotFoundCuponApplicationException } from "../../application-exception/not-found-cupon-application-exception";
export class FindAllCuponsApplicationService extends 
IApplicationService<FindAllCuponsApplicationRequestDTO, FindAllCuponsApplicationResponseDTO[]> {
    constructor(
        private readonly queryCuponRepository: IQueryCuponRepository
    ) {
        super();
    }

    async execute(data: FindAllCuponsApplicationRequestDTO): Promise<Result<FindAllCuponsApplicationResponseDTO[]>> {
        // Ajustar la paginación
        data.page = data.page * data.perPage - data.perPage;

        // Consultar los cupones a través del repositorio
        let response = await this.queryCuponRepository.findAllCupons(data);
        if (!response.isSuccess()) {
            return Result.fail(new NotFoundCuponApplicationException());
        }

        let cupons = response.getValue;

        // Mapear los cupones al formato de respuesta esperado
        let responseDto: FindAllCuponsApplicationResponseDTO[] = [];

        cupons.forEach((cupon) => {
            responseDto.push({
                id: cupon.getId().Value,
                code: cupon.CuponCode.Value,
                discount: cupon.CuponDiscount.Value,
                name: cupon.CuponName.Value,
                state: cupon.CuponState.Value
            });
        });

        return Result.success(responseDto);
    }
}
