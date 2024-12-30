import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface"
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface"
import { ProductCaducityDate } from "src/product/domain/value-object/product-caducity-date"
import { ProductDescription } from "src/product/domain/value-object/product-description"
import { ProductID } from "src/product/domain/value-object/product-id"
import { ProductImage } from "src/product/domain/value-object/product-image"
import { ProductName } from "src/product/domain/value-object/product-name"
import { ProductPrice } from "src/product/domain/value-object/product-price"
import { ProductStock } from "src/product/domain/value-object/product-stock"
import { ProductWeigth } from "src/product/domain/value-object/product-weigth"
import { ErrorProductNameAlreadyExistApplicationException } from "../../application-exepction/error-product-name-already-exist-application-exception"
import { ErrorUploadingImagesApplicationException } from "../../application-exepction/error-uploading-images-application-exception"
import { UpdateProductApplicationRequestDTO } from "../../dto/request/update-product-application-request-dto"
import { UpdateProductApplicationResponseDTO } from "../../dto/response/update-product-application-response-dto"
import { IQueryProductRepository } from "../../query-repository/query-product-repository"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"
import { ErrorDTOUpdatingProductApplicationException } from "../../application-exepction/error-dto-updating-product-application-exception"
import { ErrorDeletingImagesApplicationException } from "../../application-exepction/error-deleting-images-application-exception"
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"


export class UpdateProductApplicationService extends IApplicationService 
<UpdateProductApplicationRequestDTO,UpdateProductApplicationResponseDTO> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly commandProductRepository:ICommandProductRepository,
        private readonly queryProductRepository:IQueryProductRepository,
        private readonly fileUploader:IFileUploader,
        private readonly idGen:IIdGen<string>
    ){
        super()
    }
    async execute(command: UpdateProductApplicationRequestDTO): Promise<Result<UpdateProductApplicationResponseDTO>> {

        if (!command.caducityDate && 
            !command.currency &&
            !command.description &&
            !command.images &&
            !command.measurement &&
            !command.name &&
            !command.price &&
            !command.stock &&
            !command.weigth
        )
            return Result.fail(new ErrorDTOUpdatingProductApplicationException())

        let search=await this.queryProductRepository.findProductById(
            ProductID.create(command.productId)
        )

        if (!search.isSuccess())
            return Result.fail(new NotFoundProductApplicationException())

        const product=search.getValue

        if(command.description)
            product.updateDescription(ProductDescription.create(command.description))

        if(command.caducityDate)
            product.updateCaducityDate(ProductCaducityDate.create(command.caducityDate))

        if (command.currency && !command.price)
            product.updateCurrency(ProductPrice.create(
                product.ProductPrice.Price,
                command.currency
            )
        )

        if (command.price && !command.currency)
            product.updateCurrency(ProductPrice.create(
                command.price,
                product.ProductPrice.Currency
            )
        )

        if(command.currency && command.price){
            product.updateCurrency(ProductPrice.create(command.price,command.currency))
        }

        if (command.weigth && command.measurement)
            product.updateWeigth(ProductWeigth.create(command.weigth,command.measurement))

        if (command.name){
            let nameResponse= await this.queryProductRepository.verifyProductExistenceByName(
                ProductName.create(command.name)
            )
            if (!nameResponse.isSuccess())
                return Result.fail( new ErrorProductNameAlreadyExistApplicationException(command.name))
            if (nameResponse.getValue)
                return Result.fail( new ErrorProductNameAlreadyExistApplicationException(command.name))

            product.updateName(ProductName.create(command.name))
        }

        if(command.stock)
            product.updateStock(ProductStock.create(command.stock))

        if(command.images){
            let productImages:ProductImage[]=[]
            
            for(const image of product.ProductImages){
            
            let fileResponse=await this.fileUploader.deleteFile(image.Value)

            if (!fileResponse.isSuccess())
                return Result.fail(new ErrorDeletingImagesApplicationException())
            }

            for (const updatedimages of command.images){
                let fileResponse=await this.fileUploader.uploadFile(
                    updatedimages,
                    TypeFile.image,
                    await this.idGen.genId()
                )

                if (!fileResponse.isSuccess())
                    return Result.fail(new ErrorUploadingImagesApplicationException())
                productImages.push(ProductImage.create(fileResponse.getValue.url))
            }  
            product.updateImages(productImages)
        }

        let updateResponse= await this.commandProductRepository.updateProduct(product)
        
        if (!updateResponse.isSuccess())
            return Result.fail(updateResponse.getError)


        await this.eventPublisher.publish(product.pullDomainEvents())

        return Result.success({
            productId:product.getId().Value,
            name: product.ProductName.Value,
            description: product.ProductDescription.Value,
            caducityDate: product.ProductCaducityDate
            ? product.ProductCaducityDate.Value
            : null,
            stock: product.ProductStock.Value,
            images:product.ProductImages.map(image=>image.Value),
            price:product.ProductPrice.Price,
            currency:product.ProductPrice.Currency,
            weigth:product.ProductWeigth.Weigth,
            measurement:product.ProductWeigth.Measure
        })
    }

}