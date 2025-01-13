import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { ErrorUpdatinDirectionApplicationException } from "../../application-exeption/error-updating-directions-application-exception"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"
import { AddUserDirectionsApplicationRequestDTO } from "../../dto/request/add-user-direction-application-request-dto"
import { AddUserDirectionApplicationResponseDTO } from "../../dto/response/add-user-direction-application-response-dto"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { UserDirection } from "src/user/domain/entities/directions/direction.entity"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { DirectionId } from '../../../domain/entities/directions/value-objects/direction-id';
import { DirectionFavorite } from "src/user/domain/entities/directions/value-objects/direction-favorite"
import { DirectionLat } from "src/user/domain/entities/directions/value-objects/direction-lat"
import { DirectionLng } from "src/user/domain/entities/directions/value-objects/direction-lng"
import { DirectionName } from "src/user/domain/entities/directions/value-objects/direction-name"



export class AddUserDirectionApplicationService extends IApplicationService 
<AddUserDirectionsApplicationRequestDTO,AddUserDirectionApplicationResponseDTO> {

    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly idGen:IIdGen<string>,
    ){
        super()
    }
    
    async execute(data: AddUserDirectionsApplicationRequestDTO): Promise<Result<AddUserDirectionApplicationResponseDTO>> {
        let userRepoResponse = await this.queryUserRepository.findUserById(UserId.create(data.userId))


        if (!userRepoResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        const direction= UserDirection.create(
                DirectionId.create(await this.idGen.genId()),
                DirectionFavorite.create(data.directions.favorite),
                DirectionLat.create(data.directions.lat),
                DirectionLng.create(data.directions.long),
                DirectionName.create(data.directions.name)
            )

        let user=userRepoResponse.getValue

        user.addDirection(direction)

        let userResponse= await this.commandUserRepository.updateUser(user)
        
        if (!userResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        this.eventPublisher.publish(user.pullDomainEvents())
        
        return Result.success(
            {
                id:direction.getId().Value,
                name: direction.DirectionName.Value,
                direction: data.directions.direction,
                favorite: direction.DirectionFavorite.Value,
                lat: direction.DirectionLat.Value,
                long: direction.DirectionLng.Value
            }
        )
    }

}
