import { IServiceResponseDto } from "src/common/application/services";


export interface ModifyCourierLocationResponseDto extends IServiceResponseDto {

    orderId: string;
    lat: number;
    long: number;
}