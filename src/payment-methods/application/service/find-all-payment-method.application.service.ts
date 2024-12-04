import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
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
        
        let methods = await this.paymentMethodQueryRepository.findAllMethods(data);
        
        if(methods.isFailure()) return Result.fail( new NotFoundPaymentMethodApplicationException());

        let responseDto: FindAllPaymentMethodResponseDTO[] = methods.getValue.map(method => ({
            id: method.getId().paymentMethodId,
            name: method.name.paymentMethodName,
            state: method.state.paymentMethodState,
            imageUrl: method.image.Value
        }));

        return Result.success(responseDto);
    };
}