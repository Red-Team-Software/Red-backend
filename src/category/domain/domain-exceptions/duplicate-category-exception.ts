export class DuplicateCategoryException extends Error {
    constructor(message: string = "Category already exists") {
        super(message);
        this.name = "DuplicateCategoryException";
    }
}