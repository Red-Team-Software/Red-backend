import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { ErrorUpdatinDirectionApplicationException } from "../../application-exeption/error-updating-directions-application-exception"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"
import { AddUserDirectionsApplicationRequestDTO } from "../../dto/request/add-user-direction-application-request-dto"
import { AddUserDirectionApplicationResponseDTO } from "../../dto/response/add-user-direction-application-response-dto"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { DeleteUserDirectionInfraestructureResponseDTO } from "src/user/infraestructure/dto/response/delete-user-direction-infreaestructure-response-dto"
import { DeleteUserDirectionsApplicationRequestDTO } from "../../dto/request/delete-user-direction-application-request-dto"
import { UserDirection } from "src/user/domain/entities/directions/direction.entity"
import { DirectionFavorite } from "src/user/domain/entities/directions/value-objects/direction-favorite"
import { DirectionId } from "src/user/domain/entities/directions/value-objects/Direction-id"
import { DirectionLat } from "src/user/domain/entities/directions/value-objects/direction-lat"
import { DirectionLng } from "src/user/domain/entities/directions/value-objects/direction-lng"
import { DirectionName } from "src/user/domain/entities/directions/value-objects/direction-name"



export class DeleteUserDirectionApplicationService extends IApplicationService 
<DeleteUserDirectionsApplicationRequestDTO,AddUserDirectionApplicationResponseDTO> {

    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher,
    ){
        super()
    }
    
    async execute(data: DeleteUserDirectionsApplicationRequestDTO): Promise<Result<AddUserDirectionApplicationResponseDTO>> {
        let userRepoResponse = await this.queryUserRepository.findUserById(UserId.create(data.userId))

        if (!userRepoResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        let user=userRepoResponse.getValue

        let directions=data.directions.map(d=>DirectionId.create(d.id))

        directions.forEach(d=>{
            user.deleteDirection(d)
        })

        let userResponse= await this.commandUserRepository.updateUser(user)

        if (!userResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({userId:data.userId})
    }

}
