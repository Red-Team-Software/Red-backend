import { IServiceResponseDto } from "src/common/application/services";


export interface CancelOrderApplicationServiceResponseDto extends IServiceResponseDto {

    orderId: string;
    state: string;
    
}