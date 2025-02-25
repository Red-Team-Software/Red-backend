import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { ICalculateShippingFee } from 'src/order/domain/domain-services/interfaces/calculate-shippping-fee.interface';
import { ICalculateTaxesFee } from 'src/order/domain/domain-services/interfaces/calculate-taxes-fee.interface';
import { OrderTotalAmount } from 'src/order/domain/value_objects/order-totalAmount';
import { OrderDirection } from 'src/order/domain/value_objects/order-direction';
import { IGeocodification } from 'src/order/domain/domain-services/interfaces/geocodification-interface';
import { OrderAddressStreet } from 'src/order/domain/value_objects/order-direction-street';
import { TaxesShippingFeeApplicationServiceEntryDto } from '../../dto/request/tax-shipping-fee-request-dto';
import { ErrorObtainingShippingFeeApplicationException } from '../../application-exception/error-obtaining-shipping-fee.application.exception';
import { ErrorObtainingTaxesApplicationException } from '../../application-exception/error-obtaining-taxes.application.exception';
import { CalculateTaxesShippingResponseDto } from '../../dto/response/calculate-taxes-shipping-fee-response.dto';


export class CalculateTaxShippingFeeAplicationService extends IApplicationService<TaxesShippingFeeApplicationServiceEntryDto,CalculateTaxesShippingResponseDto>{
    
    constructor(
        private readonly calculateShippingFee: ICalculateShippingFee,
        private readonly calculateTaxesFee: ICalculateTaxesFee,
        private readonly geocodificationAddress: IGeocodification,
    ){
        super()
    }
    
    async execute(data: TaxesShippingFeeApplicationServiceEntryDto): Promise<Result<CalculateTaxesShippingResponseDto>> {
        
        let orderAddress = OrderAddressStreet.create(data.address);
        
        let address = await this.geocodificationAddress.DirecctiontoLatitudeLongitude(orderAddress);
    
        let orderDirection = OrderDirection.create(address.getValue.Latitude, address.getValue.Longitude);

        let shippingFee = await this.calculateShippingFee.calculateShippingFee(orderDirection);

        if (!shippingFee.isSuccess) return Result.fail(new ErrorObtainingShippingFeeApplicationException());

        let amount = OrderTotalAmount.create(data.amount, data.currency);

        let taxes = await this.calculateTaxesFee.calculateTaxesFee(amount);

        if (!taxes.isSuccess) return Result.fail(new ErrorObtainingTaxesApplicationException());

        return Result.success(new CalculateTaxesShippingResponseDto(
            taxes.getValue.OrderTaxes,
            shippingFee.getValue.OrderShippingFee
        ));
    }
}