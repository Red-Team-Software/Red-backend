import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidUserDirectionNameException extends DomainException{
    constructor(direction:string){super(`The user direction name is invalid direction:${direction}`)}
}