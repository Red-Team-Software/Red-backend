import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllProductsAndCombosApplicationResponseDTO extends IServiceResponseDto {
    product:{
        id:string,
        description:string,
        name:string,
        images:string[],
        price:number,
        currency:string,
    }[]
    bundle:{
        id:string,
        description:string,
        name:string,
        images:string[],
        price:number,
        currency:string,
    }[]
}