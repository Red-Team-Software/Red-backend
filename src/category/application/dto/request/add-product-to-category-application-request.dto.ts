import { IServiceRequestDto } from "src/common/application/services";

export interface AddProductToCategoryApplicationRequestDTO extends IServiceRequestDto {
    categoryId:string,
    productId:string
}