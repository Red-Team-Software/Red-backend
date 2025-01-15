import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCategoryNameException extends DomainException {
    constructor(message: string = "Category name is invalid") {
        super(message);
        this.name = "InvalidCategoryNameException";
    }
}