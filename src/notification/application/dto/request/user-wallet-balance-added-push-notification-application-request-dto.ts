import { IServiceRequestDto } from "src/common/application/services"

export interface UserWalletBalanceAddedPushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[];
    userId: string;
    userWallet:{
        amount: number;
        currency: string;
    }
}