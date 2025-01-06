import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ErrorSendingPushProductApplicationException } from "../../application-exception/error-sending-push-product-application-exception";
import { NewOrderPushNotificationApplicationRequestDTO } from "../../dto/request/new-order-push-notification-application-request-dto";
import { NewOrderPushNotificationApplicationResponseDTO } from "../../dto/response/new-order-push-notification-application-response-dto";
import { ErrorSendingPushNewOrderApplicationException } from "../../application-exception/error-sending-push-new-order-application-exception";
import { UpdateUserWalletBalancePushNotificationApplicationRequestDTO } from "../../dto/request/update-user-wallet-balance-push-notification-application-request-dto";
import { UpdateUserWalletBalancePushNotificationApplicationResponseDTO } from "../../dto/response/update-user-wallet-balance-push-notification-application-response-dto";




export class UpdateUserWalletBalancePushNotificationApplicationService extends IApplicationService<UpdateUserWalletBalancePushNotificationApplicationRequestDTO,UpdateUserWalletBalancePushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: UpdateUserWalletBalancePushNotificationApplicationRequestDTO): Promise<Result<UpdateUserWalletBalancePushNotificationApplicationResponseDTO>> {


        let sendDTO:PushNotifierRequestDto[]=[]

        data.tokens.forEach(token=>{
            sendDTO.push({
                token: token,
                notification: { 
                    title: `Money added to wallet !!!`, 
                    body: `${data.userWallet.amount} has been added to your wallet`
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