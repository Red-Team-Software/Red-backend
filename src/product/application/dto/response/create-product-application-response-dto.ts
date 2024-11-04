import { IServiceRequestDto } from "src/common/application/services"

export interface CreateProductApplicationResponseDTO extends IServiceRequestDto {
    name: string,
    desciption: string,
    caducityDate: Date,
    stock: number
    images:string[]
}