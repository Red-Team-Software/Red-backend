import { Result } from "src/common/utils/result-handler/result";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { FindAllCategoriesApplicationRequestDTO } from "../dto/request/find-all-categories-request.dto";
import { FindCategoryByIdApplicationRequestDTO } from "../dto/request/find-category-by-id-application-request.dto";
import { FindCategoryByProductIdApplicationRequestDTO } from "../dto/request/find-category-by-productid-application-request.dto";
import { CategoryName } from "src/category/domain/value-object/category-name";
export interface IQueryCategoryRepository{
    findAllCategories(criteria:FindAllCategoriesApplicationRequestDTO):Promise<Result<Category[]>>;
    findCategoryById(criteria:FindCategoryByIdApplicationRequestDTO):Promise<Result<Category>>;
    findCategoryByProductId(criteria:FindCategoryByProductIdApplicationRequestDTO):Promise<Result<Category[]>>;
    verifyCategoryExistenceByName(categoryName:CategoryName):Promise<Result<boolean>>
}