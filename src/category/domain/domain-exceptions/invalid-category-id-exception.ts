export class InvalidCategoryIdException extends Error {
    constructor(message: string = "Category ID is invalid") {
        super(message);
        this.name = "InvalidCategoryIdException";
    }
}