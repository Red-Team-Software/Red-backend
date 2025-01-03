import { IServiceRequestDto } from "src/common/application/services"

export interface FindProductsbyIdApplicationRequestDTO extends IServiceRequestDto {
    id:string
}