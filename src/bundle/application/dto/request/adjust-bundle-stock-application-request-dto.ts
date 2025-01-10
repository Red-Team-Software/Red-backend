import { IServiceRequestDto } from "src/common/application/services"

export interface AdjustBundleStockApplicationRequestDTO extends IServiceRequestDto {
    bundles:{
        id:string;
        quantity:number
    }[]
}