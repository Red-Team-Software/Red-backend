import { IServiceResponseDto } from "src/common/application/services";

export interface CreateOrderReportApplicationServiceResponseDto extends IServiceResponseDto {

    orderId: string;
    description: string;
    
}