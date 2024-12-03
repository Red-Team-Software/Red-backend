import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidWalletIdException extends DomainException{
    constructor(){super("The id of balance is not a UUID valid")}
}