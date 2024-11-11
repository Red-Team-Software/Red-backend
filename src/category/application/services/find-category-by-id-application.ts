
import { FindCategoryByIdApplicationRequestDTO } from "../dto/request/find-category-by-id-application-request.dto";
import { FindCategoryByIdApplicationResponseDTO } from "../dto/response/find-category-by-id-application-response.dto";
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindCategoryByIdApplication {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(request: FindCategoryByIdApplicationRequestDTO): Promise<FindCategoryByIdApplicationResponseDTO> {
        const category = await this.categoryRepository.findById(CategoryId.create(request.id));
        if (!category) throw new Error("Category not found");

        return {
            id: category.getId().Value,
            name: category.getName(),
            productIds: category.getProducts().map((productId) => productId.Value),
        };
    }
}
