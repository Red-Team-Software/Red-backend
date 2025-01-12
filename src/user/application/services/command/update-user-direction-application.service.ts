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
import { DirectionId } from "src/user/domain/entities/directions/value-objects/Direction-id"
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

        const directionsUpdated=data.directions.map(d=>
            UserDirection.create(
                DirectionId.create(d.id),
                DirectionFavorite.create(d.favorite),
                DirectionLat.create(d.lat),
                DirectionLng.create(d.long),
                DirectionName.create(d.name)
            )
        )


        user.updateDirection(directionsUpdated)

        let userResponse= await this.commandUserRepository.updateUser(user)

        if (!userResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({userId:data.userId})
    }

}
