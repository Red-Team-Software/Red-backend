import { IServiceRequestDto } from "src/common/application/services"

export interface UpdateCategoryApplicationRequestDTO extends IServiceRequestDto {
    categoryId:string,
    name?:string,
    image?:Buffer,
    products?:string[],
    bundles?:string[]
}