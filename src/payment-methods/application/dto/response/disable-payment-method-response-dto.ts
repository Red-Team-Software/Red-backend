import { IServiceResponseDto } from "src/common/application/services";

export interface DisablePaymentMethodResponseDto extends IServiceResponseDto {

    id_payment_method: string;
    
}