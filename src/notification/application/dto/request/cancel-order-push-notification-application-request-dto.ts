import { IServiceRequestDto } from "src/common/application/services"

export interface CancelOrderPushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[];
    orderId:string;   
    orderState:string;
}