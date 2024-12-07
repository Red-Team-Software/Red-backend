import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services";
import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { ErrorSendingPushOrderCanceledApplicationException } from "../../application-exception/error-sending-push-order-canceled-application-exception";
import { OrderDeliveredPushNotificationApplicationRequestDTO } from "../../dto/request/order-delivered-push-notification-application-request-dto";
import { OrderDeliveredPushNotificationApplicationResponseDTO } from "../../dto/response/order-delivered-push-notification-application-response-dto";


export class OrderDeliveredPushNotificationApplicationService extends IApplicationService<OrderDeliveredPushNotificationApplicationRequestDTO,OrderDeliveredPushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: OrderDeliveredPushNotificationApplicationRequestDTO): Promise<Result<OrderDeliveredPushNotificationApplicationResponseDTO>> {


        let sendDTO:PushNotifierRequestDto[]=[];

        data.tokens.forEach(token=>{
            sendDTO.push({
                token: token,
                notification: { 
                    title: `Orden ha sido entregada`, 
                    body: `Tu orden con el numero #[${data.orderId}] ha sido entregada con exito.`
                },
                data:{
                    route: `/order/:${data.orderId}`
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