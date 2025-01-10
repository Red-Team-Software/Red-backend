import { IServiceRequestDto } from "src/common/application/services";


export interface RefundPaymentApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
}