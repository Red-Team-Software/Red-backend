import { IServiceResponseDto } from "src/common/application/services"

export interface CreateProductApplicationResponseDTO extends IServiceResponseDto {
    productId:string
    name: string,
    description: string,
    caducityDate?: Date,
    stock: number
    images:string[]
    price:number
    currency:string
    weigth:number
    measurement:string
}