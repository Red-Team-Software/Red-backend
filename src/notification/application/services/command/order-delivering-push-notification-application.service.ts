import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services";
import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { OrderDeliveringPushNotificationApplicationRequestDTO } from "../../dto/request/order-delivering-push-notification-application-request-dto";
import { OrderDeliveringPushNotificationApplicationResponseDTO } from "../../dto/response/order-delivering-push-notification-application-response-dto";


export class OrderDeliveringPushNotificationApplicationService extends IApplicationService<OrderDeliveringPushNotificationApplicationRequestDTO,OrderDeliveringPushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: OrderDeliveringPushNotificationApplicationRequestDTO): Promise<Result<OrderDeliveringPushNotificationApplicationResponseDTO>> {


        let sendDTO:PushNotifierRequestDto[]=[];

        data.tokens.forEach(token=>{
            sendDTO.push({
                token: token,
                notification: { 
                    title: `Orden en camino`, 
                    body: `Tu orden con el numero #[${data.orderId}] ha sido recibida por el repartidor y va en camino.`
                }
            })
        });

        for (const sendData of sendDTO){
            if(sendData.token)
                await this.pushNotifier.sendNotificationByToken(sendData)
        };

        return Result.success({succses:true});
    };
}