import { IServiceRequestDto } from "src/common/application/services";


export interface DeliveredOrderApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
}