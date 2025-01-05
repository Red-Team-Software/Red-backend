import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"

export interface FindAllBundlesApplicationRequestDTO extends PaginationRequestDTO {
    category?:string[] 
    name?:string
    price?:number
    popular?:string
    discount?:number
}