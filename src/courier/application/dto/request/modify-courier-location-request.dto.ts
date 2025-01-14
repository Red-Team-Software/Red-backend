import { IServiceRequestDto } from "src/common/application/services";


export interface ModifyCourierLocationRequestDto extends IServiceRequestDto {
    userId: string;
    
    courierId: string;
    lat: number;
    long: number;
}