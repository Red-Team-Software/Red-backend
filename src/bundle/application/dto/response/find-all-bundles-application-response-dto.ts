import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllBundlesApplicationResponseDTO extends IServiceResponseDto {
    id:string,
    description:string,
    name:string,
    images:string[],
    price:number,
    currency:string,
}