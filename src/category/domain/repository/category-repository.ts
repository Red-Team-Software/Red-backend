import { Category } from "../aggregate/category";
import { CategoryId } from "../value-object/category-id";

export interface CategoryRepository {
    save(category: Category): Promise<void>;
    findById(id: CategoryId): Promise<Category | null>;
    delete(id: CategoryId): Promise<void>;
    findAll(): Promise<Category[]>;
}