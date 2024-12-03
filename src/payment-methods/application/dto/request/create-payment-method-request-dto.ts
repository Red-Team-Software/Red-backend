import { IServiceRequestDto } from "src/common/application/services";


export interface CreatePaymentMethodRequestDto extends IServiceRequestDto {
    userId: string;
    name: string;
}