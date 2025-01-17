import { IApplicationService } from "src/common/application/services";
import { FindAllPaymentMethodRequestDto } from "../dto/request/find-all-payment-method-request.dto";
import { FindAllPaymentMethodResponseDTO } from "../dto/response/find-all-payment-method-response.dto";
import { Result } from "src/common/utils/result-handler/result";
import { IPaymentMethodQueryRepository } from "../query-repository/orm-query-repository.interface";
import { NotFoundPaymentMethodApplicationException } from "../application-exception/not-found-payment-method-application.exception";


export class FindAllPaymentMethodApplicationService extends IApplicationService<FindAllPaymentMethodRequestDto,FindAllPaymentMethodResponseDTO[]>{

    constructor(
        private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository
    ){
        super();
    }

    async execute(data: FindAllPaymentMethodRequestDto): Promise<Result<FindAllPaymentMethodResponseDTO[]>> {
        let methods = await this.paymentMethodQueryRepository.findAllMethodsDetail(data);
        
        if(methods.isFailure()) return Result.fail( new NotFoundPaymentMethodApplicationException());

        let responseDto: FindAllPaymentMethodResponseDTO[] = methods.getValue.map(method => ({
            id: method.paymentMethodId,
            name: method.paymentMethodName,
            state: method.paymentMethodState,
            image: method.paymentMethodImage
        }));

        return Result.success(responseDto);
    };
}