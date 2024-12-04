import { ISession } from "src/auth/application/model/session.interface";
import { IServiceRequestDto } from "src/common/application/services";

export interface UpdateTokenPushNotificationApplicationRequest extends IServiceRequestDto {
    session:ISession,
    token:string
}