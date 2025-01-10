import { IServiceRequestDto } from "src/common/application/services"

export interface AdjustProductStockApplicationRequestDTO extends IServiceRequestDto {
    products:{
        id:string;
        quantity:number
    }[]
}