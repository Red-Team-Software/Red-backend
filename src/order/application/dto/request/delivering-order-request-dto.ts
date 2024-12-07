import { IServiceRequestDto } from "src/common/application/services";


export interface DeliveringOrderApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
}