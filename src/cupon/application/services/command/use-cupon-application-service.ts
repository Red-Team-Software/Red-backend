import { IApplicationService } from 'src/common/application/services/application.service.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';
import { UserId } from 'src/user/domain/value-object/user-id';
import { IQueryCuponRepository } from 'src/cupon/domain/query-repository/query-cupon-repository';
import { ICuponRepository } from 'src/cupon/domain/repository/cupon.interface.repository';
import { NotFoundCuponApplicationException } from '../../application-exception/not-found-cupon-application-exception';
import { CuponAlreadyUsedException } from '../../application-exception/cupon-already-use-application-exception';
import { UseCuponApplicationRequestDTO } from '../../dto/request/use-cupon-application-requestdto';
import { UseCuponApplicationResponseDTO } from '../../dto/response/use-cupon-application-responsedto';
import { CuponCode } from 'src/cupon/domain/value-object/cupon-code';

export class UseCuponApplicationService extends IApplicationService<
    UseCuponApplicationRequestDTO,UseCuponApplicationResponseDTO
> {
    constructor(
        private readonly queryCuponRepository: IQueryCuponRepository,
        private readonly commandCuponRepository: ICuponRepository
    ) {
        super();
    }

    async execute(data: UseCuponApplicationRequestDTO): Promise<Result<UseCuponApplicationResponseDTO>> {
        const { userId, cuponCode } = data;

        const cupon = await this.queryCuponRepository.findCuponByCode(CuponCode.create(cuponCode));
        
        if(!cupon.isSuccess()){
            return Result.fail(new NotFoundCuponApplicationException())
        }
        // 1. Verificar si el cupon y usuario existen
        const cuponUserResult = await this.queryCuponRepository.findCuponUserByUserAndCupon(
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
        const saveResult = await this.commandCuponRepository.saveCuponUser(cuponUser);

        if (!saveResult.isSuccess()) {
            return Result.fail(saveResult.getError);
        }

        const responseDto: UseCuponApplicationResponseDTO = {
            userId: data.userId,
            cuponId: cupon.getValue.getId().Value,
            discount: cupon.getValue.CuponDiscount.Value,
            status: 'used',
        };
    
        return Result.success(responseDto);
    }
}
