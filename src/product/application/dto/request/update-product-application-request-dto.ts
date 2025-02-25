import { IServiceRequestDto } from "src/common/application/services"

export interface UpdateProductApplicationRequestDTO extends IServiceRequestDto {
    productId:string
    name?: string,
    description?: string,
    caducityDate?: Date,
    stock?: number
    images?:Buffer[]
    price?:number
    currency?:string
    weigth?:number
    measurement?:string
}