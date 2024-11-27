import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ErrorSendingPushProductApplicationException } from "../../application-exception/error-sending-push-product-application-exception";
import { NewOrderPushNotificationApplicationRequestDTO } from "../../dto/request/new-order-push-notification-application-request-dto";
import { NewOrderPushNotificationApplicationResponseDTO } from "../../dto/response/new-order-push-notification-application-response-dto";




export class NewOrderPushNotificationApplicationService extends IApplicationService<NewOrderPushNotificationApplicationRequestDTO,NewOrderPushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: NewOrderPushNotificationApplicationRequestDTO): Promise<Result<NewOrderPushNotificationApplicationResponseDTO>> {


        let sendDTO:PushNotifierRequestDto[]=[]

        let currencySymbol = data.currency === 'usd' ? '$' : data.currency === 'eur' ? '€' : data.currency;

        data.tokens.forEach(token=>{
            sendDTO.push({
                token: token,
                notification: { 
                    title: `Salio una nueva orden !!!`, 
                    body: `La orden se encuentra en estado ${data.orderState} con un valor de ${data.totalAmount}${currencySymbol} espero que este satisfecho con nuestros servicios!`,
                } 
            })
        })

        for (const sendData of sendDTO){
            let result= await this.pushNotifier.sendNotificationByToken(sendData)
            if (!result.isSuccess())
                return Result.fail(new ErrorSendingPushProductApplicationException())

        }

        return Result.success({succses:true})

    }

}