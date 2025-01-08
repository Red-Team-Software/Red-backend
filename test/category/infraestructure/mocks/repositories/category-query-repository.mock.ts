import { Result } from "src/common/utils/result-handler/result";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { IQueryCategoryRepository } from "src/category/application/query-repository/query-category-repository";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { FindAllCategoriesApplicationRequestDTO } from "src/category/application/dto/request/find-all-categories-request.dto";
import { FindCategoryByIdApplicationRequestDTO } from "src/category/application/dto/request/find-category-by-id-application-request.dto";
import { FindCategoryByProductIdApplicationRequestDTO } from "src/category/application/dto/request/find-category-by-productid-application-request.dto";
import { FindCategoryByBundleIdApplicationRequestDTO } from "src/category/application/dto/request/find-category-by-bundle-id-application-request.dto";
import { ICategory } from "src/category/application/model/category.model";

export class CategoryQueryRepositoryMock implements IQueryCategoryRepository {
    private categories: Category[] = [];

    constructor(categories: Category[] = []) {
        this.categories = categories;
    }

    async findAllCategories(criteria: FindAllCategoriesApplicationRequestDTO): Promise<Result<Category[]>> {
        const { page, perPage } = criteria;
        const paginatedCategories = this.categories.slice(page * perPage, (page + 1) * perPage);
        return Result.success(paginatedCategories);
    }

    async findCategoryById(criteria: CategoryID): Promise<Result<Category>> {
        const category = this.categories.find((c) => c.getId().equals(criteria));
        if (!category) {
            return Result.fail(new NotFoundException('Category not found.'));
        }
        return Result.success(category);
    }

    async findCategoryByProductId(criteria: FindCategoryByProductIdApplicationRequestDTO): Promise<Result<Category[]>> {
        const filteredCategories = this.categories.filter((c) =>
            c.Products.some((p) => p.Value === criteria.id)
        );
        return Result.success(filteredCategories);
    }

    async findCategoryByBundleId(criteria: FindCategoryByBundleIdApplicationRequestDTO): Promise<Result<Category[]>> {
        const filteredCategories = this.categories.filter((c) =>
            c.Bundles.some((b) => b.Value === criteria.id)
        );
        return Result.success(filteredCategories);
    }

    async findCategoryByName(categoryName: CategoryName): Promise<Result<boolean>> {
        const category = this.categories.find((c) => c.Name.equals(categoryName));
        return Result.success(!!category);
    }
}
