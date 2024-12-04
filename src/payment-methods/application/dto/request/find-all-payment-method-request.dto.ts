import { IServiceRequestDto } from 'src/common/application/services';


export interface FindAllPaymentMethodRequestDto extends IServiceRequestDto {
    userId: string;
    
    page?: number;
    perPage?: number;
}