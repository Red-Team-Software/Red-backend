import { IServiceResponseDto } from "src/common/application/services";


export interface RefundPaymentApplicationServiceResponseDto extends IServiceResponseDto {

    orderId: string;
    state: string;
    
}