import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { NewCuponPushNotificationApplicationRequestDTO } from "../../dto/request/new-cupon-push-notification-application-request-dto";
import { NewCuponPushNotificationApplicationResponseDTO } from "../../dto/response/new-cupon-push-notification-application-response-dto";
import { ErrorSendingPushCuponApplicationException } from "../../application-exception/error-sending-push-cupon-application-exception";



export class NewCuponPushNotificationApplicationService extends IApplicationService<NewCuponPushNotificationApplicationRequestDTO,NewCuponPushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: NewCuponPushNotificationApplicationRequestDTO): Promise<Result<NewCuponPushNotificationApplicationResponseDTO>> {


        let sendDTO:PushNotifierRequestDto[]=[]

        //let currencySymbol = data.currency === 'usd' ? '$' : data.currency === 'eur' ? '€' : data.currency;

        let currencySymbol="%"
        data.tokens.forEach(token=>{
            sendDTO.push({
                token: token,
                notification: { 
                    title: `Salio un nuevo cupón!!!`, 
                    body: `El cupón es ${data.name} con un valor de ${data.discount}${currencySymbol} si quieres verlo, entra ya!`,
                } 
            })
        })

        for (const sendData of sendDTO){
            let result= await this.pushNotifier.sendNotificationByToken(sendData)
            if (!result.isSuccess())
                return Result.fail(new ErrorSendingPushCuponApplicationException())

        }

        return Result.success({succses:true})

    }

}