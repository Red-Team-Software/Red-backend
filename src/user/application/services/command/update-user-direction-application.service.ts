import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { ErrorUpdatinDirectionApplicationException } from "../../application-exeption/error-updating-directions-application-exception"
import { UpdateUserDirectionsApplicationRequestDTO } from "../../dto/request/update-user-direction-application-request-dto"
import { UpdateUserDirectionsApplicationResponseDTO } from "../../dto/response/update-user-direction-application-response-dto"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"
import { UserDirection } from "src/user/domain/entities/directions/direction.entity"
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id"
import { DirectionFavorite } from "src/user/domain/entities/directions/value-objects/direction-favorite"
import { DirectionLat } from "src/user/domain/entities/directions/value-objects/direction-lat"
import { DirectionLng } from "src/user/domain/entities/directions/value-objects/direction-lng"
import { DirectionName } from "src/user/domain/entities/directions/value-objects/direction-name"


export class UpdateUserDirectionApplicationService extends IApplicationService 
<UpdateUserDirectionsApplicationRequestDTO,UpdateUserDirectionsApplicationResponseDTO> {

    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher,
    ){
        super()
    }
    
    async execute(data: UpdateUserDirectionsApplicationRequestDTO): Promise<Result<UpdateUserDirectionsApplicationResponseDTO>> {
        let userRepoResponse = await this.queryUserRepository.findUserById(UserId.create(data.userId))

        if (!userRepoResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        let user=userRepoResponse.getValue

        const direction = UserDirection.create(
                DirectionId.create(data.directions.id),
                DirectionFavorite.create(data.directions.favorite),
                DirectionLat.create(data.directions.lat),
                DirectionLng.create(data.directions.long),
                DirectionName.create(data.directions.name)
            )

        user.updateDirection(direction)

        let userResponse= await this.commandUserRepository.updateUser(user)

        if (!userResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({
            id:direction.getId().Value,
            name: direction.DirectionName.Value,
            direction: data.directions.name,
            favorite: direction.DirectionFavorite.Value,
            lat: direction.DirectionLat.Value,
            long: direction.DirectionLng.Value,   
        })
        
    }
}
