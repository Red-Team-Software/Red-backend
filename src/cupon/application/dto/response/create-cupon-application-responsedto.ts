import { IServiceResponseDto } from "src/common/application/services";

export interface CreateCuponApplicationResponseDTO extends IServiceResponseDto {
    code: string; // Código único del cupón
    name: string;
    discount: number; // Valor del descuento (porcentaje o monto fijo)
    state: boolean;
}
