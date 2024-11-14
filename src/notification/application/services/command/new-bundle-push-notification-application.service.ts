import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ErrorSendingPushProductApplicationException } from "../../application-exception/error-sending-push-product-application-exception";
import { NewBundlePushNotificationApplicationRequestDTO } from "../../dto/request/new-bundle-push-notification-application-request-dto";
import { NewProductPushNotificationApplicationResponseDTO } from "../../dto/response/new-product-push-notification-application-response-dto";



export class AddNewBundlePushNotificationApplicationService extends IApplicationService<NewBundlePushNotificationApplicationRequestDTO,NewProductPushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: NewBundlePushNotificationApplicationRequestDTO): Promise<Result<NewProductPushNotificationApplicationResponseDTO>> {


        let sendDTO:PushNotifierRequestDto[]=[]

        let currencySymbol = data.currency === 'usd' ? '$' : data.currency === 'eur' ? '€' : data.currency;

        data.tokens.forEach(token=>{
            sendDTO.push({
                token: token,
                notification: { 
                    title: `Salio un nuevo combo!!!`, 
                    body: `El combo es ${data.name} con un valor de ${data.price}${currencySymbol}
                    si quieres ver los, entra ya!`,
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