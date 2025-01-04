import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"

export interface FindAllProductsApplicationRequestDTO extends PaginationRequestDTO {
    
    category?:string[] 
    name?:string
    price?:number
    popular?:string
    discount?:number
}