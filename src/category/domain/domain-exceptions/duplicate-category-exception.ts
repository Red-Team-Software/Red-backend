import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class DuplicateCategoryException extends DomainException {
    constructor(message: string = "Category already exists") {
        super(message);
        this.name = "DuplicateCategoryException";
    }
}