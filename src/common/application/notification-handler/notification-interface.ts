import { Result } from "../../utils/result-handler/result";
import { PushNotifierDto } from "./dto/entry/push-notifier.dto";

export interface IPushNotifier {
    sendNotificationByToken(data: PushNotifierDto): Promise<Result<string>>;
}