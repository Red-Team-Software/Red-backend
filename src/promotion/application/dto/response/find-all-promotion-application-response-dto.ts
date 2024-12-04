import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllPromotionApplicationResponseDTO extends IServiceResponseDto {
    id:string
    description:string
    name:string
    avaleableState:boolean
    discount:number
    products:string[]
    bundles:string[]
    categories:string[]
}