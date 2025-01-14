import { IServiceResponseDto } from "src/common/application/services";


export interface FindOrderCourierPositionApplicationServiceResponseDto extends IServiceResponseDto {

    latActual: number;
    longActual: number;
    longPuntoLlegada: number;
    latPuntoLlegada: number;
    
}