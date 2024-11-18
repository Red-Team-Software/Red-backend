import { IServiceRequestDto } from "src/common/application/services"

export interface NewBundlePushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[]
    name:string;
    price:number;
    currency:string
}