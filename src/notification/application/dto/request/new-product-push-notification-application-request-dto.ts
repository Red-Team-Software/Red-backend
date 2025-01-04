import { IServiceRequestDto } from "src/common/application/services"

export interface NewProductPushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[]
    name:string;
    price:number;
    currency:string
    productId:string
}