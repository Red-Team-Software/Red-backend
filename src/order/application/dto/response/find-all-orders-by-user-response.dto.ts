import { IServiceResponseDto } from "src/common/application/services";
import { IOrderModel } from "../../model/order.model.interface";

export interface FindAllOrdersApplicationServiceResponseDto extends IServiceResponseDto, IOrderModel {
    
}