import { IApplicationService } from 'src/common/application/services';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { Result } from 'src/common/utils/result-handler/result';
import { ICategoryRepository } from 'src/category/domain/repository/category-repository.interface';
import { IQueryCategoryRepository } from 'src/category/application/query-repository/query-category-repository';
import { UpdateCategoryApplicationRequestDTO } from '../../dto/request/update-category-application-request-dto';
import { UpdateCategoryApplicationResponseDTO } from '../../dto/response/update-category-application-response-dt';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { CategoryName } from 'src/category/domain/value-object/category-name';
import { CategoryImage } from 'src/category/domain/value-object/category-image';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { NotFoundCategoryApplicationException } from '../../application-exception/not-found-category-application-exception';
import { ErrorDTOUpdatingCategoryApplicationException } from 'src/category/application/application-exception/error-dto-update-category-application-exception';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { TypeFile } from 'src/common/application/file-uploader/enums/type-file.enum';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { ErrorDeletingImagesApplicationException } from 'src/product/application/application-exepction/error-deleting-images-application-exception';
import { ErrorUploadingImagesApplicationException } from '../../application-exception/error-uploading-images-application-exception';
import { ErrorUpdatingProductApplicationException } from 'src/product/application/application-exepction/error-updating-product-application-exception';
import { ErrorNameAlreadyApplicationException } from '../../application-exception/error-name-already-application-exception';
export class UpdateCategoryApplicationService extends IApplicationService<
    UpdateCategoryApplicationRequestDTO,
    UpdateCategoryApplicationResponseDTO
> {
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly commandCategoryRepository: ICategoryRepository,
        private readonly queryCategoryRepository: IQueryCategoryRepository,
        private readonly fileUpdater:IFileUploader,
        private readonly idGen:IIdGen<string>
    ) {
        super();
    }

    async execute(command: UpdateCategoryApplicationRequestDTO): Promise<Result<UpdateCategoryApplicationResponseDTO>> {
        if (!command.name && !command.image && !command.products && !command.bundles) {
            return Result.fail(new ErrorDTOUpdatingCategoryApplicationException);
        }

        const categoryResult = await this.queryCategoryRepository.findCategoryById(
            CategoryID.create(command.categoryId)
        );

        if (!categoryResult.isSuccess()) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }

        const category = categoryResult.getValue;

        if (command.name) {

            let search=await this.queryCategoryRepository.verifyCategoryExistenceByName(
                CategoryName.create(command.name)
            )
    
            if (!search.isSuccess())
                return Result.fail(new ErrorUpdatingProductApplicationException())
    
            if (search.getValue) 
                return Result.fail(new ErrorNameAlreadyApplicationException());
            
            category.updateName(CategoryName.create(command.name));
        }

        if (command.image) {

            let fileResponse=await this.fileUpdater.uploadFile( command.image,TypeFile.image,await this.idGen.genId())
            
            if(!fileResponse.isSuccess)
                return Result.fail(new ErrorUploadingImagesApplicationException)

            let fileResponseDelete=await this.fileUpdater.deleteFile(category.Image.Value)

            if (!fileResponseDelete.isSuccess())
                return Result.fail(new ErrorDeletingImagesApplicationException())

            category.updateImage(CategoryImage.create(fileResponse.getValue.url));

        }

        if (command.products) {
            const productIds = command.products.map(id => ProductID.create(id));
            category.updateProducts(productIds);
        }

        if (command.bundles) {
            const bundleIds = command.bundles.map(id => BundleId.create(id));
            category.updateBundles(bundleIds);
        }

        const updateResult = await this.commandCategoryRepository.updateCategory(category);

        if (!updateResult.isSuccess()) {
            return Result.fail(updateResult.getError);
        }

        await this.eventPublisher.publish(category.pullDomainEvents());

        return Result.success({
            categoryId: category.getId().Value,
            name: category.Name.Value,
            image: category.Image?.Value || null,
            products: category.Products.map(p => p.Value),
            bundles: category.Bundles.map(b => b.Value),
        });
    }
}
