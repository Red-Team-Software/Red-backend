import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllProductsApplicationResponseDTO extends IServiceResponseDto {
    id: string
    name:string
    images: string []
    description:string
    price: number
    currency:string
    weight: number
    measurement: string
    stock:number
    discount:{
    id:string,
    percentage:number
    name:string
    }[]
    category: {
        id: string
        name:string
    }[]
}