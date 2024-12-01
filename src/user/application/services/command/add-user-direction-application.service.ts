import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { UserDirection } from "src/user/domain/value-object/user-direction"
import { UserId } from "src/user/domain/value-object/user-id"
import { ErrorUpdatinDirectionApplicationException } from "../../application-exeption/error-updating-directions-application-exception"
import { IQueryUserRepository } from "../../repository/user.query.repository.interface"
import { AddUserDirectionsApplicationRequestDTO } from "../../dto/request/add-user-direction-application-request-dto"
import { AddUserDirectionApplicationResponseDTO } from "../../dto/response/add-user-direction-application-response-dto"



export class AddUserDirectionApplicationService extends IApplicationService 
<AddUserDirectionsApplicationRequestDTO,AddUserDirectionApplicationResponseDTO> {

    constructor(
        private readonly commandUserRepository:ICommandUserRepository,
        private readonly queryUserRepository:IQueryUserRepository,
    ){
        super()
    }
    
    async execute(data: AddUserDirectionsApplicationRequestDTO): Promise<Result<AddUserDirectionApplicationResponseDTO>> {
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
            user.addDirection(direction)
        })

        return Result.success({userId:data.userId})
    }

}
