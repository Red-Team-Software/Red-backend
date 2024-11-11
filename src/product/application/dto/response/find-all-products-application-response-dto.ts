import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllProductsApplicationResponseDTO extends IServiceResponseDto {
    id:string,
    description:string,
    name:string,
    images:string[],
    price:number,
    currency:string,
}