import { TaxesShippingFeeEntryDto } from '../../../infraestructure/dto/taxes-shipping-dto';
import { IServiceRequestDto } from '../../../../common/application/services/dto/request/service-request-dto.interface';


export class TaxesShippingFeeApplicationServiceEntryDto implements IServiceRequestDto {
    userId: string;
    amount: number;
    currency: string;
    lat: number;
    long: number;
}