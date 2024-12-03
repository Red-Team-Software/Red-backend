import { IServiceResponseDto } from "src/common/application/services";

export interface CreatePaymentMethodResponseDto extends IServiceResponseDto {

    paymentMethodId: string;
    name: string;
    state: string;
    imageUrl: string;
    
}