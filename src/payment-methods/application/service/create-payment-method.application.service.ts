import { IApplicationService } from "src/common/application/services";
import { CreatePaymentMethodRequestDto } from "../dto/request/create-payment-method-request-dto";
import { CreatePaymentMethodResponseDto } from "../dto/response/create-payment-method-response-dto";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { Result } from "src/common/utils/result-handler/result";
import { IPaymentMethodRepository } from "src/payment-methods/domain/repository/payment-method-repository.interface";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { PaymentMethodName } from '../../domain/value-objects/payment-method-name';
import { PaymentMethodState } from '../../domain/value-objects/payment-method-state';
import { ErrorSavingPaymentMethodApplicationException } from "../application-exception/error-saving-payment-method-application.exception";


export class CreatePaymentMethodApplicationService extends IApplicationService<CreatePaymentMethodRequestDto,CreatePaymentMethodResponseDto>{

    constructor(
        private readonly paymentMethodRepository: IPaymentMethodRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly idGen: IIdGen<string>,
    ){
        super();
    }

    async execute(data: CreatePaymentMethodRequestDto): Promise<Result<CreatePaymentMethodResponseDto>> {
        
        let method = PaymentMethodAgregate.RegisterPaymentMethod(
            PaymentMethodId.create(await this.idGen.genId()),
            PaymentMethodName.create(data.name),
            PaymentMethodState.create("active")
        );

        let response = await this.paymentMethodRepository.savePaymentMethod(method);

        if(response.isFailure()) return Result.fail(new ErrorSavingPaymentMethodApplicationException());
        
        let responseDto: CreatePaymentMethodResponseDto = {
            paymentMethodId: method.getId().paymentMethodId,
            name: method.name.paymentMethodName,
            state: method.state.paymentMethodState
        };

        return Result.success(responseDto);
    };
}