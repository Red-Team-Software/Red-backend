import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { UserId } from "src/user/domain/value-object/user-id";
import { FindUserDirectionsByIdApplicationResponseDTO } from "../../dto/response/find-directions-by-user-id-response-dto";
import { IQueryUserRepository } from "../../repository/user.query.repository.interface";
import { FindUserDirectionsByIdApplicationRequestDTO } from "../../dto/request/find-directions-by-user-id-request-dto";
import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { IGeocodification } from "src/order/domain/domain-services/interfaces/geocodification-interface";


export class FindUserDirectionApplicationService extends IApplicationService
    <
    FindUserDirectionsByIdApplicationRequestDTO, 
    FindUserDirectionsByIdApplicationResponseDTO[]
    > {
    
    constructor(
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly geocodification:IGeocodification
    ) {
        super();
    }

    async execute(data: FindUserDirectionsByIdApplicationRequestDTO): Promise<Result<FindUserDirectionsByIdApplicationResponseDTO[]>> {

        let response=await this.queryUserRepository.findUserById(UserId.create(data.userId));

        if (!response.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(data.userId))
        
        let directions = response.getValue
        
        let dir: FindUserDirectionsByIdApplicationResponseDTO[] = [];
        
        for (let direction of directions.UserDirections){
            let geo = OrderDirection.create(direction.DirectionLat.Value,direction.DirectionLng.Value);
            let geoReponse= await this.geocodification.LatitudeLongitudetoDirecction(geo);
      
            dir.push({
            id: direction.getId().Value,
            name: direction.DirectionName.Value,
            favorite: direction.DirectionFavorite.Value,
            lat: direction.DirectionLat.Value,
            long: direction.DirectionLng.Value,
              address:geoReponse.isSuccess()
              ? geoReponse.getValue.Address
              : 'no direction get it'
            })
          }

        return Result.success(dir)
    }
}