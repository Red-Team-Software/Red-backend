import { IServiceResponseDto } from "src/common/application/services";
import { ICategory } from "../../model/category.model";

export interface FindCategoryByIdApplicationResponseDTO extends IServiceResponseDto,ICategory {
}