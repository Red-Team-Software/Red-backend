import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllProductsApplicationResponseDTO extends IServiceResponseDto {
    productId:string,
    productDescription:string,
    productName:string,
    productImages:string[],
    productPrice:number,
    productCurrency:string
    productWeigth:number
    productMeasurement:string
}