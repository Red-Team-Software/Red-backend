import { IServiceResponseDto } from "src/common/application/services";

export interface FindCategoryByIdApplicationResponseDTO extends IServiceResponseDto {
    id: string;
    name: string;
    image: string;
    products: string[];
}