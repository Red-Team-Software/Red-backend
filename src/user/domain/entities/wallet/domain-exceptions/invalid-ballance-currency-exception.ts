import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBallanceCurrencyException extends DomainException{
    constructor(currency:string){super(
        `The Ballance is not valid currency:${currency}`
    )}
}