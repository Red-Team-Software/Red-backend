import { IServiceRequestDto } from "src/common/application/services"

export interface FindPromotionByIdApplicationRequestDTO extends IServiceRequestDto {
    id:string
}