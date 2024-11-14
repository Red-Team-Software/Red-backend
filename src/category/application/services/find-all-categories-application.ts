import { Injectable } from "@nestjs/common";
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { FindAllCategoriesRequestDTO } from "../dto/request/find-all-categories-request.dto";
import { FindAllCategoriesResponseDTO, CategoryResponse } from "../dto/response/find-all-categories-response.dto";
import { Result } from "src/common/utils/result-handler/result";
import { IApplicationService } from "src/common/application/services/application.service.interface";
import { NotFoundCategoryApplicationException } from "../application-exception/not-found-category-application-exception";

@Injectable()
export class FindAllCategoriesApplication extends IApplicationService<
    FindAllCategoriesRequestDTO,
    FindAllCategoriesResponseDTO
> {
    constructor(private readonly categoryRepository: ICategoryRepository) {
        super();
    }

    async execute(request: FindAllCategoriesRequestDTO): Promise<Result<FindAllCategoriesResponseDTO>> {
        const categoriesResult = await this.categoryRepository.findAll();

        if (!categoriesResult.isSuccess()) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }

        const categories = categoriesResult.getValue;

        const categoryResponses: CategoryResponse[] = categories.map((category) => ({
            id: category.getId().Value,
            name: category.getCategoryName().Value,
            image: category.getCategoryImage() ? category.getCategoryImage().getValue() : null, // Manejo de la imagen
        }));

        return Result.success({
            categories: categoryResponses,
        });
    }
}
