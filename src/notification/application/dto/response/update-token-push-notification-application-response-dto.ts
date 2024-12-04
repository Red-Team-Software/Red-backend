import { ISession } from "src/auth/application/model/session.interface"
import { IServiceRequestDto } from "src/common/application/services"

export interface UpdateTokenPushNotificationApplicationResponse extends IServiceRequestDto {
    session:ISession
}