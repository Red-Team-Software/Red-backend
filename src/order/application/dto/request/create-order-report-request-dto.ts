import { IServiceRequestDto } from "src/common/application/services";


export interface CreateOrderReportApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
    description: string;
}