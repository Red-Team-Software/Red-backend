import { IServiceResponseDto } from "src/common/application/services";

export interface FindCuponByCodeApplicationResponseDTO extends IServiceResponseDto {
    id:string;
    code: string; // Código único del cupón
    name: string;
    discount: number; // Valor del descuento (porcentaje o monto fijo)
    state: string;
}
