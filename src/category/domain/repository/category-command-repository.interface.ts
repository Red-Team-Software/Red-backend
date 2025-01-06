
import { Result } from "src/common/utils/result-handler/result";
import { Category } from "../aggregate/category.aggregate";
import { CategoryID } from "../value-object/category-id";
import { CategoryName } from "../value-object/category-name";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";

export interface ICategoryCommandRepository {
    //findById(id: CategoryID): Promise<Result<Category>>;
    deleteCategoryById(id: CategoryID): Promise<Result<CategoryID>>;
    //findAll(): Promise<Result<Category[]>>;
    createCategory(category: Category): Promise<Result<Category>>;
    //verifyCategoryExistenceByName(name: CategoryName): Promise<Result<boolean>>;
    agregateProductToCategory(category:Category,product:Product):Promise<Result<boolean>>;
    agregateBundleToCategory(category:Category,bundle:Bundle):Promise<Result<boolean>>;
    //findCategoryByProductId(product:Product):Promise<Result<Category>>;
    //findCategoryByBundleId(bundle:Bundle):Promise<Result<Category>>;
    updateCategory(category:Category):Promise<Result<Category>>;
}