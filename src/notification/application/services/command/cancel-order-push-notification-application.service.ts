import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { CancelOrderPushNotificationApplicationRequestDTO } from "../../dto/request/cancel-order-push-notification-application-request-dto";
import { CancelOrderPushNotificationApplicationResponseDTO } from "../../dto/response/cancel-order-push-notification-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services";
import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { ErrorSendingPushOrderCancelledApplicationException } from "../../application-exception/error-sending-push-order-cancelled-application-exception";


export class CancelledOrderPushNotificationApplicationService extends IApplicationService<CancelOrderPushNotificationApplicationRequestDTO,CancelOrderPushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: CancelOrderPushNotificationApplicationRequestDTO): Promise<Result<CancelOrderPushNotificationApplicationResponseDTO>> {


        let sendDTO:PushNotifierRequestDto[]=[]

        data.tokens.forEach(token=>{
            sendDTO.push({
                token: token,
                notification: { 
                    title: `¡Orden Cancelada con Éxito!`, 
                    body: `La orden ${data.orderId} ha sido cancelada. 
                    Si tuviste algún inconveniente durante el proceso o necesitas más ayuda, 
                    te invitamos a generar un reporte para que podamos ayudarte mejor.`,
                },
                data:{
                    route: `/order/:${data.orderId}`
                }
            })
        })

        for (const sendData of sendDTO){
            if(sendData.token)
                await this.pushNotifier.sendNotificationByToken(sendData)

        }

        return Result.success({succses:true})

    }

}