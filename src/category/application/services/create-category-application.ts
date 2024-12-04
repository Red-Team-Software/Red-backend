// src/category/application/services/create-category-application.ts

import { Injectable } from "@nestjs/common";
import { CreateCategoryApplicationRequestDTO } from "../dto/request/create-category-application-request.dto";
import { CreateCategoryApplicationResponseDTO } from "../dto/response/create-category-application-response.dto";
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services/application.service.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ErrorNameAlreadyApplicationException } from "../application-exception/error-name-already-application-exception";
import { ErrorUploadingImagesApplicationException } from "../application-exception/error-uploading-images-application-exception";
import { ErrorCreatingCategoryApplicationException } from "../application-exception/error-creating-category-application-exception";
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";

export class CreateCategoryApplication extends IApplicationService<
    CreateCategoryApplicationRequestDTO,
    CreateCategoryApplicationResponseDTO
> {
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly categoryRepository: ICategoryRepository,
        private readonly idGen: IIdGen<string>,
        private readonly fileUploader: IFileUploader,
    ) {
        super();
    }

    async execute(command: CreateCategoryApplicationRequestDTO): Promise<Result<CreateCategoryApplicationResponseDTO>> {
        // Check if category name already exists
        const existingCategory = await this.categoryRepository.verifyCategoryExistenceByName(
            CategoryName.create(command.name)
        );
        if (!existingCategory) {
            return Result.fail(new ErrorNameAlreadyApplicationException());
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

        console.log("Llego aqui:", uploadedImageUrl)


        // Create the Category aggregate
        const categoryId = CategoryId.create(await this.idGen.genId());
        const categoryName = CategoryName.create(command.name);
        const categoryImage = uploadedImageUrl ? CategoryImage.create(uploadedImageUrl) : null;
        const category = Category.create(categoryId, categoryName,categoryImage);

        // Save category to repository
        const saveResult = await this.categoryRepository.createCategory(category);
        if (!saveResult.isSuccess()) {
            return Result.fail(new ErrorCreatingCategoryApplicationException());
        }

        // Prepare response
        const response: CreateCategoryApplicationResponseDTO = {
            id: categoryId.Value,
            name: categoryName.Value,
            image:categoryImage.Value,
        };

        return Result.success(response);
    }
}
