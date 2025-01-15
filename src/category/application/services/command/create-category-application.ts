// src/category/application/services/create-category-application.ts

import { CreateCategoryApplicationRequestDTO } from "../../dto/request/create-category-application-request.dto";
import { CreateCategoryApplicationResponseDTO } from "../../dto/response/create-category-application-response.dto";
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services/application.service.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ErrorNameAlreadyApplicationException } from "../../application-exception/error-name-already-application-exception";
import { ErrorUploadingImagesApplicationException } from "../../application-exception/error-uploading-images-application-exception";
import { ErrorCreatingCategoryApplicationException } from "../../application-exception/error-creating-category-application-exception";
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ProductID } from "src/product/domain/value-object/product-id";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { IQueryCategoryRepository } from "../../query-repository/query-category-repository";

export class CreateCategoryApplication extends IApplicationService<
    CreateCategoryApplicationRequestDTO,
    CreateCategoryApplicationResponseDTO
> {
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly categoryRepository: ICategoryRepository,
        private readonly categoryqueryRepository: IQueryCategoryRepository,
        private readonly productQueryRepository: IQueryProductRepository,
        private readonly bundleQueryRepository: IQueryBundleRepository,
        private readonly idGen: IIdGen<string>,
        private readonly fileUploader: IFileUploader,
    ) {
        super();
    }

    async execute(command: CreateCategoryApplicationRequestDTO): Promise<Result<CreateCategoryApplicationResponseDTO>> {
        // Check if category name already exists
        const existingCategory = await this.categoryqueryRepository.verifyCategoryExistenceByName(
            CategoryName.create(command.name)
        )

        if (!existingCategory.isSuccess())
            return Result.fail(new ErrorCreatingCategoryApplicationException())

        if (existingCategory.getValue) 
            return Result.fail(new ErrorNameAlreadyApplicationException());

        const products:Product[]=[]

        const bundles:Bundle[]=[]

        for (const productId of command.products) {
            const productResult = await this.productQueryRepository.findProductById(ProductID.create(productId));
            if (!productResult.isSuccess()) 
                return Result.fail(productResult.getError)
            products.push(productResult.getValue)
        }

        for (const bundleId of command.bundles) {
            const bundleResult=await this.bundleQueryRepository.findBundleById(BundleId.create(bundleId))
            if(!bundleResult.isSuccess())
                return Result.fail(bundleResult.getError)
            bundles.push(bundleResult.getValue)
        }


        // Handle image upload
        let uploadedImageUrl = null;
        const image=command.image;
        if (image) {
            const imageId = await this.idGen.genId();
            const imageUploadResult = await this.fileUploader.uploadFile(image, TypeFile.image, imageId);

            if (!imageUploadResult.isSuccess()) {
                return Result.fail(new ErrorUploadingImagesApplicationException());
            }

            uploadedImageUrl = imageUploadResult.getValue.url;
        }

        const category=Category.create(
            CategoryID.create(await this.idGen.genId()),
            CategoryName.create(command.name),
            CategoryImage.create(uploadedImageUrl),
            products
            ? products.map(product=>ProductID.create(product.getId().Value))
            : [],
            bundles
            ? bundles.map(bundle=>BundleId.create(bundle.getId().Value))
            : []
        )



        // Save category to repository
        const saveResult = await this.categoryRepository.createCategory(category);
        if (!saveResult.isSuccess()) {
            return Result.fail(new ErrorCreatingCategoryApplicationException());
        }

        this.eventPublisher.publish(category.pullDomainEvents())

        // Prepare response
        const response: CreateCategoryApplicationResponseDTO = {
            ...command,
            image:category.Image.Value,
            id: category.getId().Value
        };

        return Result.success(response);
    }
}
