import { IServiceResponseDto } from "src/common/application/services"

export interface CreateBundleApplicationResponseDTO extends IServiceResponseDto {
    bundleId:string
    name: string,
    description: string,
    caducityDate: Date,
    stock: number
    images:string[]
    price:number
    currency:string
    weigth:number
    measurement:string
    productId:string[]
}