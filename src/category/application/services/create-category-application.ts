
import { CreateCategoryApplicationRequestDTO } from "../dto/request/create-category-application-request.dto";
import { CreateCategoryApplicationResponseDTO } from "../dto/response/create-category-application-response.dto";
import { Category } from "src/category/domain/aggregate/category";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { ProductID } from "src/product/domain/value-object/product-id";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCategoryApplication {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(request: CreateCategoryApplicationRequestDTO): Promise<CreateCategoryApplicationResponseDTO> {
        const categoryId = CategoryId.create(await this.generateId());
        const categoryName = CategoryName.create(request.name);

        const productIds = request.productIds ? request.productIds.map((id) => ProductID.create(id)) : [];

        const category = Category.create(categoryId, categoryName, productIds);

        await this.categoryRepository.save(category);

        return {
            id: category.getId().Value,
            name: category.getName(),
            productIds: productIds.map((productId) => productId.Value),
        };
    }

    private async generateId(): Promise<string> {
        return Math.random().toString(36).substring(2, 15);
    }
}
