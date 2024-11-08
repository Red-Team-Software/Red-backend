import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"

export interface FindAllProductsApplicationRequestDTO extends PaginationRequestDTO {
    name:string
}