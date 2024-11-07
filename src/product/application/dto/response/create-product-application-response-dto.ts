import { IServiceResponseDto } from "src/common/application/services"

export interface CreateProductApplicationResponseDTO extends IServiceResponseDto {
    name: string,
    description: string,
    caducityDate: Date,
    stock: number
    images:string[]
}