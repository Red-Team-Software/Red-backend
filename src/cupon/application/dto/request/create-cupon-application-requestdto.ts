import { IServiceRequestDto } from "src/common/application/services";

export interface CreateCuponApplicationRequestDTO extends IServiceRequestDto {
    code: string; // Código único del cupón
    name: string;
    discount: number; // Valor del descuento (porcentaje o monto fijo)
    state: boolean;
}
