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
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { FileUploaderResponseDTO } from "src/common/application/file-uploader/dto/response/file-uploader-response-dto";
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";
import { ErrorUploadingPaymentMethodImageApplicationException } from "../application-exception/error-uploading-payment-method-image-application-service-exception";
import { PaymentMethodImage } from "src/payment-methods/domain/value-objects/payment-method-image";
import { IPaymentMethodQueryRepository } from "../query-repository/orm-query-repository.interface";
import { ErrorPaymentNameAlreadyApplicationException } from "../application-exception/error-payment-name-already-exist-application-exception";
import { NotFoundPaymentMethodApplicationException } from "../application-exception/not-found-payment-method-application.exception";


export class CreatePaymentMethodApplicationService extends IApplicationService<CreatePaymentMethodRequestDto,CreatePaymentMethodResponseDto>{

    constructor(
        private readonly paymentMethodRepository: IPaymentMethodRepository,
        private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly idGen: IIdGen<string>,
        private readonly fileUploader:IFileUploader
    ){
        super();
    }

    async execute(data: CreatePaymentMethodRequestDto): Promise<Result<CreatePaymentMethodResponseDto>> {

        let paymentExistanceResponse=await this.paymentMethodQueryRepository.verifyMethodRegisteredByName(
            PaymentMethodName.create(data.name)
        )

        if (paymentExistanceResponse.getError)
            return Result.fail(new NotFoundPaymentMethodApplicationException())

        if (paymentExistanceResponse.getValue)
            return Result.fail(new ErrorPaymentNameAlreadyApplicationException(data.name))

        let uploaded:FileUploaderResponseDTO
        let idImage=await this.idGen.genId()
        
        let imageuploaded=await this.fileUploader.uploadFile(data.image,TypeFile.image,idImage);
        
        if(!imageuploaded.isSuccess()) 
            return Result.fail(new ErrorUploadingPaymentMethodImageApplicationException());

        uploaded = imageuploaded.getValue;

        let method = PaymentMethodAgregate.RegisterPaymentMethod(
            PaymentMethodId.create(await this.idGen.genId()),
            PaymentMethodName.create(data.name),
            PaymentMethodState.create("active"),
            PaymentMethodImage.create(uploaded.url)
        );

        let response = await this.paymentMethodRepository.savePaymentMethod(method);

        if(response.isFailure()) 
            return Result.fail(new ErrorSavingPaymentMethodApplicationException());

        this.eventPublisher.publish(method.pullDomainEvents())
        
        let responseDto: CreatePaymentMethodResponseDto = {
            paymentMethodId: method.getId().paymentMethodId,
            name: method.name.paymentMethodName,
            state: method.state.paymentMethodState,
            imageUrl: method.image.Value
        };

        return Result.success(responseDto);
    };
}