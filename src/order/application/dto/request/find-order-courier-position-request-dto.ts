import { IServiceRequestDto } from "src/common/application/services";


export interface FindOrderCourierPositionRequestDto extends IServiceRequestDto {
    userId: string;
    orderId: string;
}