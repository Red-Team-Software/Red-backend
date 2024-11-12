import { IServiceRequestDto } from "src/common/application/services"

export interface OrderPayApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    amount: number;
    currency: string;
    paymentMethod: string;
    lat: number;
    long: number;
    

}