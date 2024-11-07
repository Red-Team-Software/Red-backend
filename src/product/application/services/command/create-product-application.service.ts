import { IApplicationService } from "src/common/application/services/application.service.interface";
import { Result } from "src/common/utils/result-handler/result";
import { CreateProductApplicationRequestDTO } from "../../dto/request/create-product-application-request-dto";
import { CreateProductApplicationResponseDTO } from "../../dto/response/create-product-application-response-dto";
import { IProductRepository } from "src/product/domain/repository/product.interface.repositry";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductDescription } from "src/product/domain/value-object/product-description";
import { ProductCaducityDate } from "src/product/domain/value-object/product-caducity-date";
import { ProductName } from "src/product/domain/value-object/product-name";
import { ProductStock } from "src/product/domain/value-object/product-stock";
import { ProductImage } from "src/product/domain/value-object/product-image";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ProductPrice } from "src/product/domain/value-object/product-price";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";
import { FileUploaderResponseDTO } from "src/common/application/file-uploader/dto/response/file-uploader-response-dto";
import { ErrorCreatingProductApplicationException } from "../../application-exepction/error-creating-product-application-exception";
import { ErrorNameAlreadyApplicationException } from "../../application-exepction/error-name-already-exist-application-exception";
import { ErrorUploadingImagesApplicationException } from "../../application-exepction/error-uploading-images-application-exception";
import { ProductWeigth } from "src/product/domain/value-object/product-weigth";

export class CreateProductApplicationService extends IApplicationService 
<CreateProductApplicationRequestDTO,CreateProductApplicationResponseDTO> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly productRepository:IProductRepository,
        private readonly idGen:IIdGen<string>,
        private readonly fileUploader:IFileUploader
    ){
        super()
    }
    async execute(command: CreateProductApplicationRequestDTO): Promise<Result<CreateProductApplicationResponseDTO>> {
        let search=await this.productRepository.verifyProductExistenceByName(ProductName.create(command.name))

        if (!search.isSuccess())
            return Result.fail(new ErrorCreatingProductApplicationException())

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
        let product=Product.RegisterProduct(
            ProductID.create(id),
            ProductDescription.create(command.description),
            ProductCaducityDate.create(command.caducityDate),
            ProductName.create(command.name),
            ProductStock.create(command.stock),
            uploaded.map((image)=>ProductImage.create(image.url)),
            ProductPrice.create(command.price,command.currency.toLowerCase()),
            ProductWeigth.create(command.weigth,command.measurement)
        )
        let result=await this.productRepository.createProduct(product)
        if (!result.isSuccess()) 
            return Result.fail(new ErrorCreatingProductApplicationException())
        this.eventPublisher.publish(product.pullDomainEvents())
        let response:CreateProductApplicationResponseDTO={
            ...command,
            images:product.ProductImages.map(image=>image.Value)
        }
        return Result.success(response)
    }

}