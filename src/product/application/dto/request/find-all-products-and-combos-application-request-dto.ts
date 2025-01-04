import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"

export interface FindAllProductsbyNameApplicationRequestDTO extends PaginationRequestDTO {
    name:string
}