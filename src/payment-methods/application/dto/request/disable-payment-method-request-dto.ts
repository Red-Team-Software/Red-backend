import { IServiceRequestDto } from "src/common/application/services";


export interface DisablePaymentMethodRequestDto extends IServiceRequestDto {
    userId: string;
    paymentMethodId: string;
}