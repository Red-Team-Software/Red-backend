import { IServiceRequestDto } from "src/common/application/services";

export interface FindCuponByCodeApplicationRequestDTO extends IServiceRequestDto {
    code: string; // Código único del cupón a buscar
}
