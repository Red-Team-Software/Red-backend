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
                    title: `Order on the way`, 
                    body: `Your order with the number #[${data.orderId}] has been received by the courier and is on its way.`
                }, 
                data:{
                    route: `/order/${data.orderId}`
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