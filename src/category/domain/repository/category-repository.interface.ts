
import { Result } from "src/common/utils/result-handler/result";
import { Category } from "../aggregate/category.aggregate";
import { CategoryID } from "../value-object/category-id";
import { CategoryName } from "../value-object/category-name";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";

export interface ICategoryRepository {
    deleteCategoryById(id: CategoryID): Promise<Result<CategoryID>>;
    createCategory(category: Category): Promise<Result<Category>>;
    agregateProductToCategory(category:Category,product:Product):Promise<Result<boolean>>;
    agregateBundleToCategory(category:Category,bundle:Bundle):Promise<Result<boolean>>;
    updateCategory(category:Category):Promise<Result<Category>>;
}