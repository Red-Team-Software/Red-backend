import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { AddUserCouponApplicationResponseDTO } from "../../dto/response/add-user-coupon-application-response-dto"
import { IQueryCuponRepository } from "src/cupon/application/query-repository/query-cupon-repository"
import { ErrorUpdatinngUserCuponsApplicationException } from "../../application-exeption/error-updating-user-cupons-application-exception"
import { AddUserCouponApplicationRequestDTO } from "../../dto/request/add-user-coupon-application-request-dto"
import { CuponId } from "src/cupon/domain/value-object/cupon-id"
import { NotFoundCouponApplicationException } from "../../application-exeption/not-found-coupon-application.exception"



export class AddUserCouponApplicationService extends IApplicationService 
<AddUserCouponApplicationRequestDTO,AddUserCouponApplicationResponseDTO> {

    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly queryCuponRepository:IQueryCuponRepository,
        private readonly eventPublisher: IEventPublisher,
    ){
        super()
    }
    
    async execute(data: AddUserCouponApplicationRequestDTO): Promise<Result<AddUserCouponApplicationResponseDTO>> {

        let userRepoResponse = await this.queryUserRepository.findUserById(UserId.create(data.userId))

        if (!userRepoResponse.isSuccess())
            return Result.fail(new ErrorUpdatinngUserCuponsApplicationException(data.userId,data.idCoupon))

        let user=userRepoResponse.getValue

        let couponresponse= await this.queryCuponRepository.findCuponById(
            CuponId.create(data.idCoupon)
        )

        if (!couponresponse.isSuccess())
            return Result.fail(new NotFoundCouponApplicationException(data.idCoupon))

        const coupon=couponresponse.getValue

        user.aplyCoupon(coupon.getId())

        let userResponse= await this.commandUserRepository.saveUser(user)
        
        if (!userResponse.isSuccess())
            return Result.fail(new ErrorUpdatinngUserCuponsApplicationException(data.userId,data.idCoupon))

        this.eventPublisher.publish(user.pullDomainEvents())
        
        return Result.success(
            {
                idCoupon:data.idCoupon
            }
        )
    }

}
