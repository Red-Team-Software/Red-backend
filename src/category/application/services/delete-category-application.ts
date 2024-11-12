
import { Injectable } from "@nestjs/common";
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { DeleteCategoryApplicationRequestDTO } from "../dto/request/delete-category-application-request.dto";
import { DeleteCategoryApplicationResponseDTO } from "../dto/response/delete-category-application-response.dto";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCategoryApplicationException } from "../application-exception/not-found-category-application-exception";

@Injectable()
export class DeleteCategoryApplication {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(request: DeleteCategoryApplicationRequestDTO): Promise<Result<DeleteCategoryApplicationResponseDTO>> {
        const categoryId = CategoryId.create(request.id);

        // Verificar si la categoría existe antes de eliminarla
        const existingCategory = await this.categoryRepository.findById(categoryId);
        if (!existingCategory) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }

        // Intentar eliminar la categoría
        await this.categoryRepository.delete(categoryId);

        const response: DeleteCategoryApplicationResponseDTO = {
            message: `Category with ID ${request.id} has been successfully deleted.`,
        };

        return Result.success(response);
    }
}
