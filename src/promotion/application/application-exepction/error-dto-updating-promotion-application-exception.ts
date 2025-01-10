import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorDTOUpdatingPromotionApplicationException extends ApplicationException{
    constructor() {
        super('Error during updating of promotion, at least one od the parameters description ,discount, name, products, state , bundles must be filled')
    }
}