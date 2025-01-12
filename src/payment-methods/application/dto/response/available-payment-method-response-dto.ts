import { IServiceResponseDto } from "src/common/application/services";

export interface AvailablePaymentMethodResponseDto extends IServiceResponseDto {

    id_payment_method: string;
    
}