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
import { ErrorCreatingProductApplicationException } from "../../application-exepction/error-creating-product-application-exception"
import { ErrorProductNameAlreadyExistApplicationException } from "../../application-exepction/error-product-name-already-exist-application-exception"
import { ErrorUploadingImagesApplicationException } from "../../application-exepction/error-uploading-images-application-exception"
import { UpdateProductApplicationRequestDTO } from "../../dto/request/update-product-application-request-dto"
import { UpdateProductApplicationResponseDTO } from "../../dto/response/update-product-application-response-dto"
import { IQueryProductRepository } from "../../query-repository/query-product-repository"
import { ApplicationException } from "src/common/application/application-exeption/application-exception"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"


export class UpdateProductApplicationService extends IApplicationService 
<UpdateProductApplicationRequestDTO,UpdateProductApplicationResponseDTO> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly commandProductRepository:ICommandProductRepository,
        private readonly queryProductRepository:IQueryProductRepository,
        private readonly fileUploader:IFileUploader
    ){
        super()
    }
    async execute(command: UpdateProductApplicationRequestDTO): Promise<Result<UpdateProductApplicationResponseDTO>> {

        let search=await this.queryProductRepository.findProductById(
            ProductID.create(command.productId)
        )

        if (!search.isSuccess())
            return Result.fail(new NotFoundProductApplicationException())

        const product=search.getValue

        if(command.caducityDate)
            product

        let updateResponse= await this.commandProductRepository.updateProduct(product)
        
        if (!updateResponse.isSuccess())
            return Result.fail(updateResponse.getError)

        return Result.success({
            productId:product.getId().Value,
            name: product.ProductName.Value,
            description: product.ProductDescription.Value,
            caducityDate: product.ProductCaducityDate.Value,
            stock: product.ProductStock.Value,
            images:product.ProductImages.map(image=>image.Value),
            price:product.ProductPrice.Price,
            currency:product.ProductPrice.Currency,
            weigth:product.ProductWeigth.Weigth,
            measurement:product.ProductWeigth.Measure
        })
    }

}