import { IApplicationService } from "src/common/application/services";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { Result } from "src/common/utils/result-handler/result";
import { IPaymentMethodRepository } from "src/payment-methods/domain/repository/payment-method-repository.interface";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { ErrorSavingPaymentMethodApplicationException } from "../application-exception/error-saving-payment-method-application.exception";
import { IPaymentMethodQueryRepository } from "../query-repository/orm-query-repository.interface";
import { NotFoundPaymentMethodApplicationException } from "../application-exception/not-found-payment-method-application.exception";
import { AvailablePaymentMethodRequestDto } from "../dto/request/aviable-payment-method-request-dto";
import { AvailablePaymentMethodResponseDto } from "../dto/response/available-payment-method-response-dto";


export class AvailablePaymentMethodApplicationService extends IApplicationService<AvailablePaymentMethodRequestDto,AvailablePaymentMethodResponseDto>{

    constructor(
        private readonly paymentMethodRepository: IPaymentMethodRepository,
        private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository,
        private readonly eventPublisher: IEventPublisher
    ){
        super();
    }

    async execute(data: AvailablePaymentMethodRequestDto): Promise<Result<AvailablePaymentMethodResponseDto>> {
        
        let methodRes = await this.paymentMethodQueryRepository.findMethodById(
            PaymentMethodId.create(data.paymentMethodId));

        if(!methodRes.isSuccess()) 
            return Result.fail(new NotFoundPaymentMethodApplicationException());

        let method = methodRes.getValue;

        method.avaliablePayment();

        let response = await this.paymentMethodRepository.savePaymentMethod(method);

        if(response.isFailure()) 
            return Result.fail(new ErrorSavingPaymentMethodApplicationException());

        this.eventPublisher.publish(method.pullDomainEvents());
        
        let responseDto: AvailablePaymentMethodResponseDto = {
            id_payment_method: data.paymentMethodId
        };

        return Result.success(responseDto);
    };
}