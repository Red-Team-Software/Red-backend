import { IServiceRequestDto } from "src/common/application/services";

export interface AddProductToCategoryApplicationResponseDTO extends IServiceRequestDto {
    categoryId:string,
    productId:string
}