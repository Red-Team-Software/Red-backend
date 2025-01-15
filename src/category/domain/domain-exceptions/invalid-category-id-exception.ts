import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCategoryIdException extends DomainException {
    constructor(message: string = "Category ID is invalid") {
        super(message);
        this.name = "InvalidCategoryIdException";
    }
}