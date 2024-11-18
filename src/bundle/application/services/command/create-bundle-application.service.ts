import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleCaducityDate } from "src/bundle/domain/value-object/bundle-caducity-date"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleImage } from "src/bundle/domain/value-object/bundle-image"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"
import { CreateBundleApplicationRequestDTO } from "../../dto/request/create-bundle-application-request-dto"
import { ErrorCreatingBundleApplicationException } from "../../application-exeption/error-creating-bundle-application-exception"
import { ErrorNameAlreadyApplicationException } from "../../application-exeption/error-name-already-exist-application-exception"
import { ErrorUploadingImagesApplicationException } from "../../application-exeption/error-uploading-images-application-exception"
import { FileUploaderResponseDTO } from "src/common/application/file-uploader/dto/response/file-uploader-response-dto"
import { IApplicationService } from "src/common/application/services"
import { IBundleRepository } from "src/bundle/domain/repository/product.interface.repositry"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { ProductID } from "src/product/domain/value-object/product-id"
import { Result } from "src/common/utils/result-handler/result"
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum"
import { CreateBundleApplicationResponseDTO } from "../../dto/response/create-bundles-application-response-dto"

export class CreateBundleApplicationService extends IApplicationService 
<CreateBundleApplicationRequestDTO,CreateBundleApplicationResponseDTO> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly bunldeRepository:IBundleRepository,
        private readonly idGen:IIdGen<string>,
        private readonly fileUploader:IFileUploader
    ){
        super()
    }
    async execute(command: CreateBundleApplicationRequestDTO): Promise<Result<CreateBundleApplicationResponseDTO>> {
        
        let search=await this.bunldeRepository.verifyBundleExistenceByName(BundleName.create(command.name))

        if (!search.isSuccess())
            return Result.fail(new ErrorCreatingBundleApplicationException())

        if (search.getValue) 
            return Result.fail(new ErrorNameAlreadyApplicationException())

        let uploaded:FileUploaderResponseDTO[]=[]
        for (const image of command.images){
            let idImage=await this.idGen.genId()
            let imageuploaded=await this.fileUploader.uploadFile(image,TypeFile.image,idImage)
            
            if(!imageuploaded.isSuccess())
                return Result.fail(new ErrorUploadingImagesApplicationException())
    
            uploaded.push(imageuploaded.getValue)
        }


        let id=await this.idGen.genId()
        let bundle=Bundle.Registerbundle(
            BundleId.create(id),
            BundleDescription.create(command.description),
            BundleCaducityDate.create(command.caducityDate),
            BundleName.create(command.name),
            BundleStock.create(command.stock),
            uploaded.map(image=>BundleImage.create(image.url)),
            BundlePrice.create(command.price,command.currency),
            BundleWeigth.create(command.weigth,command.measurement),
            command.productId.map(id=>ProductID.create(id))
        )
        let result=await this.bunldeRepository.createBundle(bundle)

        if (!result.isSuccess()) 
            return Result.fail(new ErrorCreatingBundleApplicationException())
    
        await this.eventPublisher.publish(bundle.pullDomainEvents())
    
        let response:CreateBundleApplicationResponseDTO={
            ...command,
            images:bundle.BundleImages.map(image=>image.Value)
        }
        return Result.success(response)
    }

}