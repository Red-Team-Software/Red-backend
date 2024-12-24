import { ApplicationException } from "src/common/application/application-exeption/application-exception";
export class NotFoundCategoryApplicationException extends ApplicationException {
    constructor() {
        super("Category not found.");
    }
}
