import { IServiceRequestDto } from "src/common/application/services";


export interface ModifyCourierLocationRequestDto extends IServiceRequestDto {
    userId: string;
    
    orderId: string;
    lat: number;
    long: number;
    adress: string;
}