import { IServiceRequestDto } from "src/common/application/services"

export interface PaginationRequestDTO extends IServiceRequestDto {
    page:number
    perPage:number
}