// src/category/domain/repository/category-repository.interface.ts

import { Result } from "src/common/utils/result-handler/result";
import { Category } from "../aggregate/category";
import { CategoryId } from "../value-object/category-id";
import { CategoryName } from "../value-object/category-name";
export interface ICategoryRepository {

    save(category: Category): Promise<Result<void>>;
    findById(id: CategoryId): Promise<Result<Category | null>>;
    delete(id: CategoryId): Promise<Result<void>>;
    findAll(): Promise<Result<Category[]>>;
    verifyCategoryExistenceByName(name: CategoryName): Promise<Result<boolean>>; // Nuevo método

}
