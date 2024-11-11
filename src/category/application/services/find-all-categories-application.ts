import { FindAllCategoriesResponseDTO, CategoryResponse } from "../dto/response/find-all-categories-response.dto";
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllCategoriesApplication {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(): Promise<FindAllCategoriesResponseDTO> {
        const categories = await this.categoryRepository.findAll();

        const categoryResponses: CategoryResponse[] = categories.map((category) => ({
            id: category.getId().Value,
            name: category.getName(),
            productIds: category.getProducts().map((productId) => productId.Value),
        }));

        return {
            categories: categoryResponses,
        };
    }
}
