import { IServiceRequestDto } from "src/common/application/services"

export interface CreatePromotionApplicationRequestDTO extends IServiceRequestDto {
    description:string
    name:string
    avaleableState:boolean
    discount:number
    products:string[]
    bundles:string[]
    categories:string[]
}