import { ValueObject } from "src/common/domain";
import { InvalidCategoryNameException } from "../domain-exceptions/invalid-category-name-exception";

export class CategoryName implements ValueObject<CategoryName> {

    private readonly name: string;

    equals(valueObject: CategoryName): boolean {
        return this.Value === valueObject.Value;
    }
    
    get Value(): string {
        return this.name;
    }

    static create(name: string): CategoryName {
        if (!name || name.trim().length === 0) {
            throw new InvalidCategoryNameException("Category name cannot be empty");
        }
        if (name.length > 50) {
            throw new InvalidCategoryNameException("Category name cannot exceed 50 characters");
        }
        return new CategoryName(name);
    }

    private constructor(name: string) {
        this.name = name;
    }
}