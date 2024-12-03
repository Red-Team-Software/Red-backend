import { IServiceRequestDto } from "src/common/application/services"

export interface OrderDeliveredPushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[];
    orderId:string;   
    orderState:string;
}