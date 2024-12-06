export class CategoryNotFoundException extends Error {
    constructor(message: string = "Category not found") {
        super(message);
        this.name = "CategoryNotFoundException";
    }
}