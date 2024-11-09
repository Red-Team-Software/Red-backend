import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllProductsAndCombosApplicationResponseDTO extends IServiceResponseDto {
    product:{
        productId:string,
        productDescription:string,
        productName:string,
        productImages:string[],
        productPrice:number,
        productCurrency:string
    }[]
    bundle:{
        bunldleId:string,
        bunldleDescription:string,
        bunldleName:string,
        bunldleImages:string[],
        bunldlePrice:number,
        bunldleCurrency:string
    }[]
}