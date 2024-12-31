import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllPromotionApplicationResponseDTO extends IServiceResponseDto {
    id:string
    description:string
    name:string
    state:string
    discount:number
    products:string[]
    bundles:string[]
    categories:string[]
}