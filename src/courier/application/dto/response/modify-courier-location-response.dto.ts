import { IServiceResponseDto } from "src/common/application/services";


export interface ModifyCourierLocationResponseDto extends IServiceResponseDto {

    courierId: string;
    lat: number;
    long: number;
}