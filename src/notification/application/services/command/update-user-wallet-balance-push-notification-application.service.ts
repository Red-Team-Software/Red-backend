import { PushNotifierRequestDto } from "src/common/application/notification-handler/dto/request/push-notifier-request-dto";
import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { UpdateUserWalletBalancePushNotificationApplicationResponseDTO } from "../../dto/response/update-user-wallet-balance-push-notification-application-response-dto";
import { UserWalletBalanceAddedPushNotificationApplicationRequestDTO } from "../../dto/request/user-wallet-balance-added-push-notification-application-request-dto";




export class UpdateUserWalletBalancePushNotificationApplicationService extends IApplicationService<UserWalletBalanceAddedPushNotificationApplicationRequestDTO,UpdateUserWalletBalancePushNotificationApplicationResponseDTO>{
    constructor(
        private readonly pushNotifier:IPushNotifier,
    ){
        super()
    }
    async execute(data: UserWalletBalanceAddedPushNotificationApplicationRequestDTO): Promise<Result<UpdateUserWalletBalancePushNotificationApplicationResponseDTO>> {


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