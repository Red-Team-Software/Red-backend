import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllBundlesApplicationResponseDTO extends IServiceResponseDto {
    id: string
    name:string
    image: string [ ]
    price: number
    currency:string
    weight: number
    measurement: string
    stock:number
    discount:{
    id:string,
    percentage:number 
    }[]
    category: {
        id: string
        name:string
    }[]
}