import { ICategoryCommandRepository } from "src/category/domain/repository/category-command-repository.interface";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCategoryApplicationException } from "src/category/application/application-exception/not-found-category-application-exception";
import { ErrorCreatingCategoryApplicationException } from "src/category/application/application-exception/error-creating-category-application-exception";

export class CategoryCommandRepositoryMock implements ICategoryCommandRepository {
    
    constructor(private categories: Category[] = []) {
    }

    async createCategory(category: Category): Promise<Result<Category>> {
        const exists = this.categories.some((c) => c.getId().equals(category.getId()));
        if (exists) {
            return Result.fail(new ErrorCreatingCategoryApplicationException());
        }
        this.categories.push(category);
        return Result.success(category);
    }

    async deleteCategoryById(id: CategoryID): Promise<Result<CategoryID>> {
        const index = this.categories.findIndex((c) => c.getId().equals(id));
        if (index === -1) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }
        this.categories.splice(index, 1);
        return Result.success(id);
    }

    async agregateProductToCategory(category: Category, product: Product): Promise<Result<boolean>> {
        const targetCategory = this.categories.find((c) => c.getId().equals(category.getId()));
        if (!targetCategory) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }

        const productExists = targetCategory.Products.some((p) => p.equals(product.getId()));
        if (!productExists) {
            targetCategory.addProduct(product.getId());
        }

        return Result.success(true);
    }

    async agregateBundleToCategory(category: Category, bundle: Bundle): Promise<Result<boolean>> {
        const targetCategory = this.categories.find((c) => c.getId().equals(category.getId()));
        if (!targetCategory) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }

        const bundleExists = targetCategory.Bundles.some((b) => b.equals(bundle.getId()));
        if (!bundleExists) {
            targetCategory.addBundle(bundle.getId());
        }

        return Result.success(true);
    }

    async updateCategory(category: Category): Promise<Result<Category>> {
        const index = this.categories.findIndex((c) => c.getId().equals(category.getId()));
        if (index === -1) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }
        this.categories[index] = category;
        return Result.success(category);
    }

}
