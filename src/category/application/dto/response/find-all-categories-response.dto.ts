import { IServiceResponseDto } from "src/common/application/services";

export interface CategoryResponse {
    id: string;
    name: string;
    image: string;
}

export interface FindAllCategoriesResponseDTO extends IServiceResponseDto {
    categories: CategoryResponse[];
}