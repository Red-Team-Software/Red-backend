import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class CategoryNotFoundException extends DomainException {
    constructor(message: string = "Category not found") {
        super(message);
        this.name = "CategoryNotFoundException";
    }
}