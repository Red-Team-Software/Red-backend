import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBallanceAmountException extends DomainException{
    constructor(ammount:number){super(
        `The Ballance is not valid ammount:${ammount}`
    )}
}