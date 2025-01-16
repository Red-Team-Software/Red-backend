import { IServiceResponseDto } from "src/common/application/services";


export interface FindOrderCourierPositionApplicationServiceResponseDto extends IServiceResponseDto {

    latActual: string;
    longActual: string;
    longPuntoLlegada: string;
    latPuntoLlegada: string;
    
}