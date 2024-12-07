import { IServiceResponseDto } from "src/common/application/services";


export interface DeliveringOrderApplicationServiceResponseDto extends IServiceResponseDto {

    orderId: string;
    state: string;
    
}