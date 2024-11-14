import { IServiceResponseDto } from "src/common/application/services"

export class CalculateTaxesShippingResponseDto implements IServiceResponseDto {
    
    constructor(tax: number, shipping: number){
        this.taxes = tax;
        this.shipping = shipping;
    }

    taxes: number;
    shipping: number;

}