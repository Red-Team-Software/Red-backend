import { IServiceRequestDto } from "src/common/application/services"

export interface UpdatePromotionApplicationRequestDTO extends IServiceRequestDto{
    id:string
    description?:string
    name?:string
    state?:string
    discount?:number
    products?:string[]
    bundles?:string[]
}