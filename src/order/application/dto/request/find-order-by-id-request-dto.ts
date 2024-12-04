import { IServiceRequestDto } from "src/common/application/services";


export interface FindOrderByIdRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
}