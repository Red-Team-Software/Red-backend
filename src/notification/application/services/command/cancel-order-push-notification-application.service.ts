import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { CancelOrderPushNotificationApplicationRequestDTO } from "../../dto/request/cancel-order-push-notification-application-request-dto";
import { CancelOrderPushNotificationApplicationResponseDTO } from "../../dto/response/cancel-order-push-notification-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services";
import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { ErrorSendingPushOrderCanceledApplicationException } from "../../application-exception/error-sending-push-order-canceled-application-exception";


export class CanceledOrderPushNotificationApplicationService extends IApplicationService<CancelOrderPushNotificationApplicationRequestDTO,CancelOrderPushNotificationApplicationResponseDTO>{
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
                    body: `¡Hola! La orden ${data.orderId} ha sido cancelada correctamente. 
                    Si tuviste algún inconveniente durante el proceso o necesitas más ayuda, 
                    te invitamos a generar un reporte para que podamos ayudarte mejor. 
                    ¡Estamos aquí para ayudarte!`,
                } 
            })
        })

        for (const sendData of sendDTO){
            let result= await this.pushNotifier.sendNotificationByToken(sendData)
            if (!result.isSuccess())
                return Result.fail(new ErrorSendingPushOrderCanceledApplicationException())

        }

        return Result.success({succses:true})

    }

}