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

export class MarkCuponAsUsedApplicationService extends IApplicationService<
    UseCuponApplicationRequestDTO,UseCuponApplicationResponseDTO
> {
    constructor(
        private readonly queryCuponRepository: IQueryCuponRepository,
        private readonly commandCuponRepository: ICommandCuponRepository
    ) {
        super();
    }

    async execute(data: UseCuponApplicationRequestDTO): Promise<Result<UseCuponApplicationResponseDTO>> {
        const { userId, cuponId } = data;

        const cupon = await this.queryCuponRepository.findCuponById({userId:data.userId ,id:data.cuponId});
        
        if(!cupon.isSuccess()){
            return Result.fail(new NotFoundCuponApplicationException())
        }
        // 1. Verificar si el cupon y usuario existen
        const cuponUserResult = await this.queryCuponRepository.findCuponUserByUserIdAndCuponId(
            UserId.create(userId),
            cupon.getValue.getId()
            );

        if (!cuponUserResult.isSuccess()) {
            return Result.fail(new NotFoundCuponApplicationException());
        }

        const cuponUser = cuponUserResult.getValue;

        // 2. Verificar si el cupon ya fue usado
        if (cuponUser.isCuponUsed()) {
            return Result.fail(new CuponAlreadyUsedException());
        }

        // 3. Marcar el cupon como usado
        cuponUser.markAsUsed();
        const saveResult = await this.commandCuponRepository.registerCuponUser(cuponUser);

        if (!saveResult.isSuccess()) {
            return Result.fail(saveResult.getError);
        }

        const responseDto: UseCuponApplicationResponseDTO = {
            userId: data.userId,
            cuponId: cupon.getValue.getId().Value,
            discount: cupon.getValue.CuponDiscount.Value,
            status: 'USED',
        };
    
        return Result.success(responseDto);
    }
}
