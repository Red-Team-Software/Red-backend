import { IServiceRequestDto, IServiceResponseDto } from "src/common/application/services"

export interface UpdateCategoryApplicationResponseDTO extends IServiceResponseDto {
    categoryId:string,
    name:string,
    image?:string,
    products:string[],
    bundles:string[]
}