import { IServiceRequestDto } from "src/common/application/services";

export interface FindCategoryByIdApplicationRequestDTO extends IServiceRequestDto {
    id: string; // ID de la categoría a buscar
}