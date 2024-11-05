import { IServiceResponseDto } from "src/common/application/services"

export interface CreateProductApplicationResponseDTO extends IServiceResponseDto {
    name: string,
    desciption: string,
    caducityDate: Date,
    stock: number
    images:string[]
}