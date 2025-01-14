import { IServiceResponseDto } from "src/common/application/services";


export interface AssignCourierApplicationServiceResponseDto extends IServiceResponseDto {

    orderId: string;
    state: string;
    courierId: string;
    
}