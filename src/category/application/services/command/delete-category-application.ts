
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { DeleteCategoryApplicationRequestDTO } from "../../dto/request/delete-category-application-request.dto";
import { DeleteCategoryApplicationResponseDTO } from "../../dto/response/delete-category-application-response.dto";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ErrorDeletingImagesApplicationException } from "src/product/application/application-exepction/error-deleting-images-application-exception";
import { IQueryCategoryRepository } from "../../query-repository/query-category-repository";

export class DeleteCategoryApplication extends IApplicationService<
DeleteCategoryApplicationRequestDTO,
DeleteCategoryApplicationResponseDTO
> {
    constructor(
        private readonly categoryRepository: ICategoryRepository, 
        private readonly categoryqueryRepository: IQueryCategoryRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly fileUploader: IFileUploader
    ) 
    {
        super()
    }

    async execute(request: DeleteCategoryApplicationRequestDTO): Promise<Result<DeleteCategoryApplicationResponseDTO>> {
        const categoryId = CategoryID.create(request.id);

        // Verificar si la categoría existe antes de eliminarla
        const existingCategory = await this.categoryqueryRepository.findCategoryById(categoryId);
        if (!existingCategory.isSuccess()) {
            return Result.fail(existingCategory.getError);
        }
        existingCategory.getValue.delete(existingCategory.getValue.getId()) //crear el evento del dominio

        let image=existingCategory.getValue.Image
        if(image){
            let fileResponse= await this.fileUploader.deleteFile(image.Value)
            if(!fileResponse.isSuccess())
                return Result.fail(new ErrorDeletingImagesApplicationException())
        }

        let categoryDeleteResponse= await this.categoryRepository.deleteCategoryById(categoryId);

        if (!categoryDeleteResponse.isSuccess()){
            return Result.fail(categoryDeleteResponse.getError)
        }

        await this.eventPublisher.publish(existingCategory.getValue.pullDomainEvents())

        return Result.success(request);
    }
}
