import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvaliPromotionException extends DomainException{
    constructor(){super("The promotion is not valid")}
}