export class InvalidCategoryNameException extends Error {
    constructor(message: string = "Category name is invalid") {
        super(message);
        this.name = "InvalidCategoryNameException";
    }
}