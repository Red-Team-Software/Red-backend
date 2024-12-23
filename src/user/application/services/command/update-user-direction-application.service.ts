import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserDirection } from "src/user/domain/value-object/user-direction"
import { UserId } from "src/user/domain/value-object/user-id"
import { ErrorUpdatinDirectionApplicationException } from "../../application-exeption/error-updating-directions-application-exception"
import { UpdateUserDirectionsApplicationRequestDTO } from "../../dto/request/update-user-direction-application-request-dto"
import { UpdateUserDirectionsApplicationResponseDTO } from "../../dto/response/update-user-direction-application-response-dto"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"




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

        let userDirections=data.directions.map(direction=>UserDirection.create(
            direction.name,
            direction.favorite,
            direction.lat,
            direction.lng
        ))

        let user=userRepoResponse.getValue

        let currentDirections=user.UserDirections

        user.updateDirection(userDirections)

        let modifiedDirections=user.UserDirections

        let directionsToDelete=currentDirections.filter(
            (direction)=>!modifiedDirections.find(
                (current)=>direction.equals(current)
            )
        )

        let userResponse= await this.commandUserRepository.updateUser(user)

        if (!userResponse.isSuccess())
            return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))

        if (directionsToDelete.length!==0){
            for (const directionToDelete of directionsToDelete){

                let deleteResponse=await this.commandUserRepository.deleteUserDirection(
                    user.getId(),
                    directionToDelete
                )
                if (!deleteResponse.isSuccess())
                    return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))
            }
        }

        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({userId:data.userId})
    }

}
