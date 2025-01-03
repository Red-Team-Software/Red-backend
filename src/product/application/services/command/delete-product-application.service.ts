import { IApplicationService } from "src/common/application/services/application.service.interface";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryProductRepository } from "../../query-repository/query-product-repository";
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface";
import { DeleteProductsbyIdApplicationRequestDTO } from "../../dto/request/delete-product-by-id-application-request-dto";
import { DeleteProductsbyIdApplicationResponseDTO } from "../../dto/response/delete-product-by-id-application-response-dto";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ErrorDeletingImagesApplicationException } from "../../application-exepction/error-deleting-images-application-exception";

export class DeleteProductApplicationService extends IApplicationService 
<DeleteProductsbyIdApplicationRequestDTO,DeleteProductsbyIdApplicationResponseDTO> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly commandProductRepository:ICommandProductRepository,
        private readonly queryProductRepository:IQueryProductRepository,
        private readonly fileUploader:IFileUploader
    ){
        super()
    }
    async execute(command: DeleteProductsbyIdApplicationRequestDTO): Promise<Result<DeleteProductsbyIdApplicationResponseDTO>> {

        let search=await this.queryProductRepository.findProductById(
            ProductID.create(command.id)
        )

        if (!search.isSuccess())
            return Result.fail(search.getError)

        const product=search.getValue

        product.delete(product.getId())

        for(const image of product.ProductImages){
            
            let fileResponse=await this.fileUploader.deleteFile(image.Value)

            if (!fileResponse.isSuccess())
                return Result.fail(new ErrorDeletingImagesApplicationException())
        }

        let productDeleteResponse=await this.commandProductRepository.deleteProductById(product.getId())

        if (!productDeleteResponse.isSuccess())
            return Result.fail(productDeleteResponse.getError)

        await this.eventPublisher.publish(product.pullDomainEvents())

        return Result.success({...command})
    }

}