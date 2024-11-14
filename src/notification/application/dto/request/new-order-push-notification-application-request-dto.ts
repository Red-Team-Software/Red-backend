import { IServiceRequestDto } from "src/common/application/services"

export interface NewOrderPushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[]   
    orderState:        string;
    orderCreateDate:   Date;
    totalAmount:number
    currency:string
}