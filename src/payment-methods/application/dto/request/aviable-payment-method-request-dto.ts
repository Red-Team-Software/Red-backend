import { IServiceRequestDto } from "src/common/application/services";


export interface AvailablePaymentMethodRequestDto extends IServiceRequestDto {
    userId: string;
    paymentMethodId: string;
}