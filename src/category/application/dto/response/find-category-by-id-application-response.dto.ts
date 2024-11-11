import { IServiceResponseDto } from "src/common/application/services";

export interface FindCategoryByIdApplicationResponseDTO extends IServiceResponseDto {
    id: string;
    name: string;
    productIds: string[]; // Lista de IDs de productos asociados
}