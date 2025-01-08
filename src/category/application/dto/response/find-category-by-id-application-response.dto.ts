import { IServiceResponseDto } from "src/common/application/services";
import { ICategory } from "../../model/category.model";

export interface FindCategoryByIdApplicationResponseDTO extends IServiceResponseDto {
    id: string;
    name: string;
    image: string | null;
    products: string[];
    bundles: string[];
}
