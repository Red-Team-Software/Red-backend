import { IServiceRequestDto } from "src/common/application/services";

export interface FindCategoryByProductIdApplicationRequestDTO extends IServiceRequestDto {
    id: string; // ID de la categoría a buscar
}