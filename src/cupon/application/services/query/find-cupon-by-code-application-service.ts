import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { FindCuponByCodeApplicationRequestDTO } from "../../dto/request/find-cupon-by-code-application-requestdto";
import { FindCuponByCodeApplicationResponseDTO } from "../../dto/response/find-cupon-by-code-application-responsedto";
import { NotFoundCuponApplicationException } from "src/cupon/application/application-exception/not-found-cupon-application-exception";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { IQueryCuponRepository } from "../../query-repository/query-cupon-repository";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { UserId } from "src/user/domain/value-object/user-id";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";

export class FindCuponByCodeApplicationService extends 
IApplicationService<FindCuponByCodeApplicationRequestDTO, FindCuponByCodeApplicationResponseDTO> {
    constructor(
        private readonly queryCuponRepository: IQueryCuponRepository,
        private readonly queryUserRepository: IQueryUserRepository
    ) {
        super();
    }

    async execute(data: FindCuponByCodeApplicationRequestDTO): Promise<Result<FindCuponByCodeApplicationResponseDTO>> {
        
        const cuponCode= CuponCode.create(data.cuponCode);
        const userId=UserId.create(data.userId);
        const result = await this.queryCuponRepository.findCuponByCode(cuponCode);

        const response = await this.queryCuponRepository.findCuponById(CuponId.create(data.code));

        if (!response.isSuccess() || !response.getValue) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
        let coupon = response.getValue;
        let userResponse = await this.queryUserRepository.findUserById(userId);
        if (!userResponse.isSuccess()) {
            return Result.fail(new UserNotFoundApplicationException(userId.Value));}
        if(userResponse.getValue.verifyCouponById(coupon.getId())){

        if(cuponUserResponse.getValue.isCuponUsed()){
            return Result.fail(new CuponAlreadyUsedException());
        }
        const cupon = cuponUserResponse.getValue;

        const responseDto: FindCuponByCodeApplicationResponseDTO = {
            cuponId: cupon.getId().Value,
            cuponUserId: cupon.getId().Value,
            discount: cupon.Discount.Value,
            state: cupon.State.Value
        };

        return Result.success(responseDto);
    }
}
