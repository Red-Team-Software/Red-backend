import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"

export interface FindAllPromotionApplicationRequestDTO extends PaginationRequestDTO {
    name:string
}