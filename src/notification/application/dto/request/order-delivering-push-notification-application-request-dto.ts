import { IServiceRequestDto } from "src/common/application/services"

export interface OrderDeliveringPushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[];
    orderId:string;   
    orderState:string;
}