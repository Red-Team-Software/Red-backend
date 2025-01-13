import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { ErrorUpdatinDirectionApplicationException } from "../../application-exeption/error-updating-directions-application-exception"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id"
import { DeleteUserDirectionsApplicationRequestDTO } from "../../dto/request/delete-user-direction-application-request-dto"
import { DeleteUserDirectionsApplicationResponseDTO } from "../../dto/response/delete-user-direction-application-response-dto"



export class DeleteUserDirectionApplicationService extends IApplicationService 
<DeleteUserDirectionsApplicationRequestDTO,DeleteUserDirectionsApplicationResponseDTO> {

    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
        private readonly eventPublisher: IEventPublisher,
    ){
        super()
    }
    
    async execute(data: DeleteUserDirectionsApplicationRequestDTO): Promise<Result<DeleteUserDirectionsApplicationResponseDTO>> {
        let userRepoResponse = await this.queryUserRepository.findUserById(UserId.create(data.userId))

        if (!userRepoResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        let user=userRepoResponse.getValue
        
        user.deleteDirection(DirectionId.create(data.directions.id))

        let userResponse= await this.commandUserRepository.updateUser(user)

        if (!userResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({ directionId:data.directions.id})
    }

}
