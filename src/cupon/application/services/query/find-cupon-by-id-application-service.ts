import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryCuponRepository } from "../../query-repository/query-cupon-repository";
import { FindCuponByIdApplicationRequestDTO } from "../../dto/request/find-cupon-by-id-application-requestdto";
import { FindCuponByIdApplicationResponseDTO } from "../../dto/response/find-cupon-by-id-application-responsedto";
import { NotFoundCuponApplicationException } from "../../application-exception/not-found-cupon-application-exception";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";

export class FindCuponByIdApplicationService extends 
IApplicationService<FindCuponByIdApplicationRequestDTO, FindCuponByIdApplicationResponseDTO> {
    constructor(
        private readonly queryCuponRepository: IQueryCuponRepository
    ) {
        super();
    }

    async execute(data: FindCuponByIdApplicationRequestDTO): Promise<Result<FindCuponByIdApplicationResponseDTO>> {
        const cuponId = CuponId.create(data.id);

        const response = await this.queryCuponRepository.findCuponById({...data});

        if (!response.isSuccess()) {
            return Result.fail(new NotFoundCuponApplicationException());
        }

        const cupon = response.getValue;

        const responseDto: FindCuponByIdApplicationResponseDTO = {
            id: cupon.getId().Value,
            code: cupon.CuponCode.Value,
            discount: cupon.CuponDiscount.Value,
            name: cupon.CuponName.Value,
            state: cupon.CuponState.Value
        };

        return Result.success(responseDto);
    }
}
