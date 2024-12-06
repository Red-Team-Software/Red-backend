import { IServiceRequestDto } from "src/common/application/services"

export interface UpdatePromotionApplicationRequestDTO extends IServiceRequestDto{
    id:string
    description?:string
    name?:string
    avaleableState?:boolean
    discount?:number
    products?:string[]
    bundles?:string[]
}