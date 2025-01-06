import { IServiceRequestDto } from "src/common/application/services"

export interface CreateProductApplicationRequestDTO extends IServiceRequestDto {
    name: string,
    description: string,
    images:Buffer[]
    price:number
    currency:string
    weigth:number
    measurement:string
    stock: number
    caducityDate?:Date
}