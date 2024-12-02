// src/category/domain/repository/category-repository.interface.ts

import { Result } from "src/common/utils/result-handler/result";
import { Category } from "../aggregate/category";
import { CategoryId } from "../value-object/category-id";
import { CategoryName } from "../value-object/category-name";
export interface ICategoryRepository {
    findById(id: CategoryId): Promise<Result<Category>>;
    deleteCategoryById(id: CategoryId): Promise<Result<CategoryId>>;
    findAll(): Promise<Result<Category[]>>;
    createCategory(category: Category): Promise<Result<Category>>;
    verifyCategoryExistenceByName(name: CategoryName): Promise<Result<boolean>>;
}