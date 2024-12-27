import { IServiceRequestDto } from "src/common/application/services"

export interface DeleteProductsbyIdApplicationRequestDTO extends IServiceRequestDto {
    id:string
}