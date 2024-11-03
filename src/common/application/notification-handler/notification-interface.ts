import { Result } from "../../utils/result-handler/result";
import { PushNotifierRequestDto } from "./dto/request/push-notifier-request-dto";

export interface IPushNotifier {
    sendNotificationByToken(data: PushNotifierRequestDto): Promise<Result<string>>;
}