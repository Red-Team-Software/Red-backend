import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorDTOUpdatingCategoryApplicationException extends ApplicationException{
    constructor() {
        super('Error during updating of category, at least one od the parameters name ,products, image or bundles must be filled')
    }
}