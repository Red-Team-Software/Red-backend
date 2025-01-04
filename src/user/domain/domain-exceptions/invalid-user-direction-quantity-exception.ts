import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidUserDirectionQuantityException extends DomainException{
    constructor(direction:number){super(`The user direction quantity is invalid because the total of directions is greater of 6 totaldirections:${direction}`)}
}