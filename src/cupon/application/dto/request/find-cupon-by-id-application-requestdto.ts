import { IServiceRequestDto } from "src/common/application/services";

export interface FindCuponByIdApplicationRequestDTO extends IServiceRequestDto {
    id: string; // ID del cupón a buscar
}
