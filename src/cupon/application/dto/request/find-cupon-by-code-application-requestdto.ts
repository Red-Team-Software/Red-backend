import { IServiceRequestDto } from "src/common/application/services";

export interface FindCuponByCodeApplicationRequestDTO extends IServiceRequestDto {
    cuponCode: string; // Código único del cupón a buscar
}
