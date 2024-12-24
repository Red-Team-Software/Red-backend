import { IServiceResponseDto } from "src/common/application/services";


export interface DeliveredOrderApplicationServiceResponseDto extends IServiceResponseDto {

    orderId: string;
    state: string;
    
}