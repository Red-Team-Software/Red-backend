import { IApplicationService} from 'src/common/application/services';
import { PayOrder } from '../../domain/domain-events/pay-order';
import { Result } from 'src/common/utils/result-handler/result';
import { OrderPayRequestDto } from '../dto/request/order-pay-request-dto';
import { OrderPayResponseDto } from '../dto/response/order-pay-response-dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { ICalculateShippingFee } from 'src/Order/domain/domain-services/calculate-shippping-fee.interfafe';
import { ICalculateTaxesFee } from 'src/Order/domain/domain-services/calculate-taxes-fee.interface';
import { OrderTotalAmount } from 'src/Order/domain/value_objects/order-totalAmount';
import { IPaymentService } from 'src/Order/domain/domain-services/payment-interface';
import { OrderPayment } from 'src/Order/domain/value_objects/order-payment';


export class PayOrderAplicationService implements IApplicationService<OrderPayRequestDto,OrderPayResponseDto>{
    
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly calculateShippingFee: ICalculateShippingFee,
        private readonly calculateTaxesFee: ICalculateTaxesFee,
        private readonly payOrder: IPaymentService
        //private readonly ormOrderRepository
    ){
        //super()
    }
    
    async execute(data: OrderPayRequestDto): Promise<Result<OrderPayResponseDto>> {
        try{
            let shippingFee = this.calculateShippingFee.calculateShippingFee();

            let amount = new OrderTotalAmount(data.amount);

            let taxes = this.calculateTaxesFee.calculateTaxesFee(amount);

            let total = new OrderTotalAmount(amount.OrderTotalAmount + (await shippingFee).OrderShippingFee + taxes.OrderTaxes);

            let orderPayment = new OrderPayment(total.OrderTotalAmount, data.currency, data.paymentMethod);

            let response = await this.payOrder.createPayment(orderPayment);

            if(response){
                return Result.success(new OrderPayResponseDto());
            }
        }catch(error){
            return Result.fail(error)
        }
    }
    
    get name(): string {
        throw new Error('Method not implemented.');
    }
}