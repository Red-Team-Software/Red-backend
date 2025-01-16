import { Result } from 'src/common/utils/result-handler/result';
import { IApplicationService } from '../../../common/application/services/application.service.interface';
import { CreateCourierApplicationServiceRequestDto } from '../dto/request/create-courier-application-service-request.dto';
import { CreateCourierApplicationServiceResponseDto } from '../dto/response/create-courier-application-service.response.dto';
import { ICourierRepository } from 'src/courier/application/repository/repositories-command/courier-repository-interface';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { Courier } from 'src/courier/domain/aggregate/courier';
import { FileUploaderResponseDTO } from 'src/common/application/file-uploader/dto/response/file-uploader-response-dto';
import { TypeFile } from 'src/common/application/file-uploader/enums/type-file.enum';
import { ErrorUploadingCourierImageApplicationException } from '../application-exceptions/error-uploading-image-application-service-exception';
import { CourierId } from 'src/courier/domain/value-objects/courier-id';
import { CourierName } from 'src/courier/domain/value-objects/courier-name';
import { CourierImage } from 'src/courier/domain/value-objects/courier-image';
import { ErrorCreatingCourierApplicationException } from '../application-exceptions/error-creating-courier-application-service-exception';
import { CourierDirection } from 'src/courier/domain/value-objects/courier-direction';
import { IJwtGenerator } from 'src/common/application/jwt-generator/jwt-generator.interface';
import { IEncryptor } from 'src/common/application/encryptor/encryptor.interface';
import { IMessagesPublisher } from 'src/common/application/messages/messages-publisher/messages-publisher.interface';
import { CourierAccountRegistered } from '../messages/courier-account-registered';

export class RegisterCourierApplicationService extends IApplicationService<CreateCourierApplicationServiceRequestDto,CreateCourierApplicationServiceResponseDto>{
    
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly courierRepository:ICourierRepository,
        private readonly idGen:IIdGen<string>,
        private readonly fileUploader:IFileUploader,
        private readonly jwtGen:IJwtGenerator<string>,
        private readonly encryptor:IEncryptor,
        private readonly messagePublisher:IMessagesPublisher
    ){
        super();
    }
    
    async execute(data: CreateCourierApplicationServiceRequestDto): Promise<Result<CreateCourierApplicationServiceResponseDto>> {

        let uploaded:FileUploaderResponseDTO;

        let idImage=await this.idGen.genId();
        let imageuploaded=await this.fileUploader.uploadFile(data.image,TypeFile.image,idImage);
            
        if(!imageuploaded.isSuccess()) return Result.fail(new ErrorUploadingCourierImageApplicationException());

        uploaded = imageuploaded.getValue;
        
        let id = await this.idGen.genId();

        let password= await this.encryptor.hashPassword(data.password)

        let courier: Courier = Courier.RegisterCourier(
            CourierId.create(id),
            CourierName.create(data.name),
            CourierImage.create(uploaded.url),
            CourierDirection.create(data.lat,data.long)
        );

        const jwt = this.jwtGen.generateJwt( id );

        let result = await this.courierRepository.saveCourier(courier, data.email, password);

        if (!result.isSuccess()) return Result.fail( new ErrorCreatingCourierApplicationException());

        let response: CreateCourierApplicationServiceResponseDto = {
            name: courier.CourierName.courierName,
            image: courier.CourierImage.Value,
            token: jwt
        }

        this.eventPublisher.publish(courier.pullDomainEvents());

        this.messagePublisher.publish([
            CourierAccountRegistered.create(
                id,
                data.name,
                uploaded.url,
                data.lat,
                data.long,
                data.email,
                data.password
            )
        ])

        return Result.success(response);
    }

}