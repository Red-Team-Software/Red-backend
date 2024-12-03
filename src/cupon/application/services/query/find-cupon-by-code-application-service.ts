import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ICuponRepository } from "src/cupon/domain/repository/cupon.interface.repository";
import { FindCuponByCodeApplicationRequestDTO } from "../../dto/request/find-cupon-by-code-application-requestdto";
import { FindCuponByCodeApplicationResponseDTO } from "../../dto/response/find-cupon-by-code-application-responsedto";
import { NotFoundCuponApplicationException } from "src/cupon/application/application-exception/not-found-cupon-application-exception";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";

export class FindCuponByCodeApplicationService extends 
IApplicationService<FindCuponByCodeApplicationRequestDTO, FindCuponByCodeApplicationResponseDTO> {
    constructor(
        private readonly queryCuponRepository: ICuponRepository
    ) {
        super();
    }

    async execute(data: FindCuponByCodeApplicationRequestDTO): Promise<Result<FindCuponByCodeApplicationResponseDTO>> {
        const cuponCode = CuponCode.create(data.code);

        const response = await this.queryCuponRepository.findCuponByCode(cuponCode);

        if (!response.isSuccess() || !response.getValue) {
            return Result.fail(new NotFoundCuponApplicationException());
        }

        const cupon = response.getValue;

        const responseDto: FindCuponByCodeApplicationResponseDTO = {
            id: cupon.getId().Value,
            code: cupon.CuponCode.Value,
            discount: cupon.CuponDiscount.Value,
            name: cupon.CuponName.Value,
            state: cupon.CuponState.Value
        };

        return Result.success(responseDto);
    }
}
