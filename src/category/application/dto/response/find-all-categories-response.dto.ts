import { IServiceResponseDto } from "src/common/application/services";

export interface CategoryResponse {
    id: string;
    name: string;
    productIds: string[]; // IDs de productos asociados
}

export interface FindAllCategoriesResponseDTO extends IServiceResponseDto {
    categories: CategoryResponse[]; // Lista de categorías
}