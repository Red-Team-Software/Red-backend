import { ApplicationException } from 'src/common/application/application-exeption/application-exception';

export class ErrorCreatingCategoryApplicationException extends ApplicationException {
    constructor() {
        super('Error creating category.');
    }
}