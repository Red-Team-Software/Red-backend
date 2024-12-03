import { IServiceRequestDto } from "src/common/application/services"

export interface NewCuponPushNotificationApplicationRequestDTO extends IServiceRequestDto {
    tokens:string[]
    name:string;
    discount:number;
    code:string;
    state:boolean
}