import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserDirection } from "src/user/domain/value-object/user-direction"
import { UserId } from "src/user/domain/value-object/user-id"
import { ErrorUpdatinDirectionApplicationException } from "../../application-exeption/error-updating-directions-application-exception"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"
import { AddUserDirectionsApplicationRequestDTO } from "../../dto/request/add-user-direction-application-request-dto"
import { AddUserDirectionApplicationResponseDTO } from "../../dto/response/add-user-direction-application-response-dto"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { DeleteUserDirectionInfraestructureResponseDTO } from "src/user/infraestructure/dto/response/delete-user-direction-infreaestructure-response-dto"
import { DeleteUserDirectionsApplicationRequestDTO } from "../../dto/request/delete-user-direction-application-request-dto"



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

        let userDirections=data.directions.map(direction=>UserDirection.create(
            direction.name,
            direction.favorite,
            direction.lat,
            direction.lng
        ))

        let user=userRepoResponse.getValue

        userDirections.forEach(direction=>{
            user.deleteDirection(direction)
        })

        for (const userDirection of data.directions){

            let userResponse= await this.commandUserRepository.deleteUserDirection(
                user.getId().Value,
                userDirection.id
            )

            if (!userResponse.isSuccess())
                return Result.fail(new ErrorUpdatinDirectionApplicationException(data.userId))
        }



        this.eventPublisher.publish(user.pullDomainEvents())

        return Result.success({userId:data.userId})
    }

}
