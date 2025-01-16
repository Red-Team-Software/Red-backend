import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IGeocodification } from "src/order/domain/domain-services/interfaces/geocodification-interface";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { UserId } from "src/user/domain/value-object/user-id";
import { IQueryUserRepository } from "../../repository/user.query.repository.interface";
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id";
import { FindUserDirectionByIdApplicationResponseDTO } from "../../dto/response/find-user-direction-by-id-application-response-dto";
import { FindUserDirectionByIdApplicationRequestDTO } from "../../dto/request/find-user-direction-by-id-application-request-dto";
import { ErrorAddressNotFoundApplicationException } from "../../application-exeption/error-address-not-found-application-exception";


export class FindUserDirectionByIdApplicationService extends IApplicationService
    <
    FindUserDirectionByIdApplicationRequestDTO, 
    FindUserDirectionByIdApplicationResponseDTO
    > {
    
    constructor(
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly geocodification:IGeocodification
    ) {
        super();
    }

    async execute(data: FindUserDirectionByIdApplicationRequestDTO): Promise<Result<FindUserDirectionByIdApplicationResponseDTO>> {

        let response=await this.queryUserRepository.findDirectionById(
            DirectionId.create(data.id),
            UserId.create(data.userId)
        )

        if (!response.isSuccess())
            return Result.fail(new ErrorAddressNotFoundApplicationException(data.id))
        
        let direction = response.getValue


        let address=await this.geocodification.LatitudeLongitudetoDirecction(OrderDirection.create(
            direction.DirectionLat.Value,
            direction.DirectionLng.Value
        ))

        return Result.success({
            id:direction.getId().Value,
            name: direction.DirectionName.Value,
            favorite: direction.DirectionFavorite.Value,
            lat: direction.DirectionLat.Value.toString(),
            long: direction.DirectionLng.Value.toString(),
            direction: address.isSuccess()
            ? address.getValue.Address
            : 'no direction'
        })
    }
}