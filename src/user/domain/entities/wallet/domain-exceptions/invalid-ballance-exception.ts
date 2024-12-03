import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidBallanceException extends DomainException{
    constructor(currency:string, ammount:number){super(
        `The Ballance is not valid currency:${currency} ammount:${ammount}`
    )}
}