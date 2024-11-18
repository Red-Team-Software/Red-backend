import { IServiceRequestDto } from "src/common/application/services"

export interface CreateBundleApplicationRequestDTO extends IServiceRequestDto {
    name: string,
    description: string,
    caducityDate: Date,
    stock: number
    images:Buffer[]
    price:number
    currency:string
    weigth:number
    measurement:string
    productId:string[]
}