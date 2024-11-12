import { IApplicationService} from 'src/common/application/services';
import { PayOrder } from '../../domain/domain-events/pay-order';
import { Result } from 'src/common/utils/result-handler/result';
import { OrderPayApplicationServiceRequestDto } from '../dto/request/order-pay-request-dto';
import { OrderPayResponseDto } from '../dto/response/order-pay-response-dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { ICalculateShippingFee } from 'src/Order/domain/domain-services/calculate-shippping-fee.interfafe';
import { ICalculateTaxesFee } from 'src/Order/domain/domain-services/calculate-taxes-fee.interface';
import { OrderTotalAmount } from 'src/Order/domain/value_objects/order-totalAmount';
import { IPaymentService } from 'src/Order/domain/domain-services/payment-interface';
import { OrderPayment } from 'src/Order/domain/value_objects/order-payment';
import { OrderDirection } from 'src/Order/domain/value_objects/order-direction';
import { ErrorObtainingShippingFeeApplicationException } from '../application-exception/error-obtaining-shipping-fee.application.exception';
import { ErrorCreatingPaymentApplicationException } from '../application-exception/error-creating-payment-application.exception';
import { ErrorObtainingTaxesApplicationException } from '../application-exception/error-obtaining-taxes.application.exception';
import { CalculateTaxesShippingResponseDto } from '../dto/response/calculate-taxes-shipping-fee-response.dto';
import { TaxesShippingFeeApplicationServiceEntryDto } from '../dto/request/tax-shipping-fee-request-dto';


export class CalculateTaxShippingFeeAplicationService extends IApplicationService<TaxesShippingFeeApplicationServiceEntryDto,CalculateTaxesShippingResponseDto>{
    
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly calculateShippingFee: ICalculateShippingFee,
        private readonly calculateTaxesFee: ICalculateTaxesFee
    ){
        super()
    }
    
    async execute(data: TaxesShippingFeeApplicationServiceEntryDto): Promise<Result<CalculateTaxesShippingResponseDto>> {
        let orderDirection = OrderDirection.create(data.lat, data.long);

        let shippingFee = await this.calculateShippingFee.calculateShippingFee(orderDirection);

        if (!shippingFee.isSuccess) return Result.fail(new ErrorObtainingShippingFeeApplicationException('Error obtaining shipping fee'));

        let amount = OrderTotalAmount.create(data.amount, data.currency);

        let taxes = await this.calculateTaxesFee.calculateTaxesFee(amount);

        if (!taxes.isSuccess) return Result.fail(new ErrorObtainingTaxesApplicationException('Error obtaining taxes'));

        return Result.success(new CalculateTaxesShippingResponseDto(taxes.getValue.OrderTaxes,shippingFee.getValue.OrderShippingFee));
    }
}