import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryCuponRepository } from "../../query-repository/query-cupon-repository";
import { FindCuponByCodeApplicationRequestDTO } from "../../dto/request/find-cupon-by-code-application-requestdto";
import { FindCuponByCodeApplicationResponseDTO } from "../../dto/response/find-cupon-by-code-application-responsedto";
import { NotFoundCuponApplicationException } from "src/cupon/application/application-exception/not-found-cupon-application-exception";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { UserId } from "src/user/domain/value-object/user-id";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";

export class FindCuponByCodeApplicationService extends 
IApplicationService<FindCuponByCodeApplicationRequestDTO, FindCuponByCodeApplicationResponseDTO> {
    constructor(
        private readonly queryCuponRepository: IQueryCuponRepository
    ) {
        super();
    }

    async execute(data: FindCuponByCodeApplicationRequestDTO): Promise<Result<FindCuponByCodeApplicationResponseDTO>> {
        
        const cuponCode= CuponCode.create(data.cuponCode);
        const userId=UserId.create(data.userId);
        const response = await this.queryCuponRepository.findCuponByCode(cuponCode);

        if (!response.isSuccess() || !response.getValue) {
            return Result.fail(new NotFoundCuponApplicationException());
        }

        let cuponUserResponse = await this.queryCuponRepository.findCuponUserByUserIdAndCuponId(userId, response.getValue.getId());
        if (!cuponUserResponse.isSuccess()) {
            return Result.fail(new NotFoundCuponApplicationException());}

        const cupon = cuponUserResponse.getValue;

        const responseDto: FindCuponByCodeApplicationResponseDTO = {
            cuponUserId: cupon.getId().Value,
            discount: cupon.Discount.Value,
            state: cupon.State.Value
        };

        return Result.success(responseDto);
    }
}
