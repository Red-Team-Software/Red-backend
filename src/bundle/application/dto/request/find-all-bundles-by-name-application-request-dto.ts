import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"

export interface FindAllBundlesbyNameApplicationRequestDTO extends PaginationRequestDTO {
    name:string
}