import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBallanceAmountException extends DomainException{
    constructor(ammount:number){super(
        `The Ballance is not valid ammount:${ammount}`
    )}
}