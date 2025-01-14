import { IServiceRequestDto } from "src/common/application/services";


export interface AssignCourierApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
    courierId: string;
}