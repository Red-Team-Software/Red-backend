import { IServiceRequestDto } from "src/common/application/services";


export interface CancelOrderApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
}