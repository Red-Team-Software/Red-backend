import { IApplicationService } from "src/common/application/services"
import { UpdateTokenPushNotificationApplicationRequest } from "../../dto/request/update-token-push-notification-application-request-dto"
import { UpdateTokenPushNotificationApplicationResponse } from "../../dto/response/update-token-push-notification-application-response-dto"
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface"
import { ISession } from "src/auth/application/model/session.interface"
import { Result } from "src/common/utils/result-handler/result"
import { ErrrorSavingPushTokenApplicationException } from "../../application-exception/error-saving-push-token-application-exception"



export class UpdateTokenPushNotificationApplicationService extends IApplicationService<UpdateTokenPushNotificationApplicationRequest,UpdateTokenPushNotificationApplicationResponse>{
    constructor(
        private readonly commandTokenSessionRepository:ICommandTokenSessionRepository<ISession>    ){
        super()
    }
    async execute(data: UpdateTokenPushNotificationApplicationRequest): Promise<Result<UpdateTokenPushNotificationApplicationResponse>> {

        data.session.push_token=data.token

        let commandResponse=await this.commandTokenSessionRepository.updateSession(data.session)

        if (!commandResponse.isSuccess())
            return Result.fail(new ErrrorSavingPushTokenApplicationException())
        return Result.success({...data})

    }

}