import { IApplicationService } from 'src/common/application/services/application.service.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';
import { UserId } from 'src/user/domain/value-object/user-id';
import { IQueryCuponRepository } from '../../query-repository/query-cupon-repository';
import { NotFoundCuponApplicationException } from '../../application-exception/not-found-cupon-application-exception';
import { CuponAlreadyUsedException } from '../../application-exception/cupon-already-use-application-exception';
import { UseCuponApplicationRequestDTO } from '../../dto/request/use-cupon-application-requestdto';
import { UseCuponApplicationResponseDTO } from '../../dto/response/use-cupon-application-responsedto';
import { CuponCode } from 'src/cupon/domain/value-object/cupon-code';
import { ICommandCuponRepository } from '../../../domain/repository/command-cupon-repository';
import { IQueryUserRepository } from 'src/user/application/repository/user.query.repository.interface';
import { UserNotFoundApplicationException } from 'src/auth/application/application-exception/user-not-found-application-exception';
import { CuponUserInvalidUseApplicationException } from '../../application-exception/cupon-user-invalid-use-application-exception';

export class MarkCuponAsUsedApplicationService extends IApplicationService<
    UseCuponApplicationRequestDTO,UseCuponApplicationResponseDTO
> {
    constructor(
        private readonly queryCuponRepository: IQueryCuponRepository,
        private readonly commandCuponRepository: ICommandCuponRepository,
        private readonly queryUserRepository: IQueryUserRepository
    ) {
        super();
    }

    async execute(data: UseCuponApplicationRequestDTO): Promise<Result<UseCuponApplicationResponseDTO>> {
        const { userId, cuponId } = data;

        const cupon = await this.queryCuponRepository.findCuponById(CuponId.create(data.cuponId));
        
        if(!cupon.isSuccess()){
            return Result.fail(new NotFoundCuponApplicationException())
        }
        // 1. Verificar si el cupon y usuario existen
        
        const userResponse= await this.queryUserRepository.findUserById(UserId.create(userId));

        if(!userResponse.isSuccess()){
            return Result.fail(new UserNotFoundApplicationException(userId))
        }

        const user=userResponse.getValue

        // 2. Verificar si el cupon ya fue usado
        if(!user.verifyCouponById(cupon.getValue.getId())){
            return Result.fail(new CuponUserInvalidUseApplicationException())
        }
        
        // 3. Marcar el cupon como usado

        user.aplyCoupon(cupon.getValue.getId())
        console.log(user)
        const responseDto: UseCuponApplicationResponseDTO = {
            userId: data.userId,
            cuponId: cupon.getValue.getId().Value,
            discount: cupon.getValue.CuponDiscount.Value,
            status: 'USED'
        };
    
        return Result.success(responseDto);
    }
}
